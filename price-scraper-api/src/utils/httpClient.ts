// @ts-ignore
import { addExtra } from "puppeteer-extra";
// @ts-ignore
import vanillaPuppeteer, { type Browser } from "puppeteer-core";
// @ts-ignore — pacote sem tipos bundled
import StealthPlugin from "puppeteer-extra-plugin-stealth";

const puppeteer = addExtra(vanillaPuppeteer);
puppeteer.use(StealthPlugin());

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
];

export function getRandomUserAgent(): string {
  const index = Math.floor(Math.random() * USER_AGENTS.length);
  return USER_AGENTS[index] ?? USER_AGENTS[0]!;
}

import fs from "fs";

function getExecutablePath(): string {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const windowsChromePaths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  for (const p of windowsChromePaths) {
    if (fs.existsSync(p)) return p;
  }
  return "/usr/bin/chromium-browser";
}

// Singleton de browser com auto-recuperação em caso de crash
let sharedBrowser: Browser | null = null;
let launchLock: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
  if (sharedBrowser) return sharedBrowser;
  if (launchLock) return launchLock;

  launchLock = puppeteer
    .launch({
      executablePath: getExecutablePath(),
      headless: true, // Alpine Chromium não suporta "new"
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-blink-features=AutomationControlled",
      ],
    })
    .then((browser: Browser) => {
      sharedBrowser = browser;

      // Monitorar desconexão para garantir recuperação automática
      browser.on("disconnected", () => {
        console.warn("[Puppeteer] Browser desconectado. Resetando singleton para recuperação.");
        sharedBrowser = null;
        launchLock = null;
      });

      return browser;
    })
    .catch((err: unknown) => {
      // Garantir reset em caso de falha no launch
      sharedBrowser = null;
      launchLock = null;
      throw err;
    }) as Promise<Browser>;

  return launchLock;
}

// Semáforo simples para limitar concorrência de páginas
let openPages = 0;
const MAX_CONCURRENT_PAGES = 2;
const pageQueue: Array<() => void> = [];

async function acquirePage(): Promise<void> {
  if (openPages < MAX_CONCURRENT_PAGES) {
    openPages++;
    return;
  }
  return new Promise((resolve) => pageQueue.push(resolve));
}

function releasePage(): void {
  const next = pageQueue.shift();
  if (next) {
    next();
  } else {
    openPages--;
  }
}

import axios from "axios";

export async function fetchHtml(url: string, extraHeaders: Record<string, string> = {}): Promise<string> {
  // Estratégia 1: Tentar via HTTP Axios rápido com User-Agent rotativo
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": getRandomUserAgent(),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        ...extraHeaders,
      },
      timeout: 10000,
    });
    if (res.data && typeof res.data === "string" && res.data.length > 500) {
      return res.data;
    }
  } catch (axiosErr) {
    // Se o HTTP direto falhar (bloqueio WAF ou necessidade de JS), tenta Puppeteer abaixo
  }

  // Estratégia 2: Puppeteer Headless (para ambientes com Chrome/Chromium instalado)
  await acquirePage();
  let page: Awaited<ReturnType<Awaited<ReturnType<typeof puppeteer.launch>>["newPage"]>> | null = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    await page.setUserAgent(getRandomUserAgent());

    if (Object.keys(extraHeaders).length > 0) {
      await page.setExtraHTTPHeaders(extraHeaders);
    }

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await new Promise((r) => setTimeout(r, 1500));

    return await page.content();
  } catch (error) {
    console.error(`[Scraper Engine] Falha na busca por ${url}:`, (error as Error).message);
    return "";
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
    releasePage();
  }
}
