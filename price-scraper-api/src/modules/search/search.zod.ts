import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().min(2, "A busca deve conter pelo menos 2 caracteres"),
  category: z.enum(["IMOVEIS", "VEICULOS", "JOGOS", "ELETRONICOS", "OUTROS"]).default("OUTROS"),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  platform: z.string().default("ALL"),
  sortBy: z.enum(["price_asc", "price_desc", "rating_desc", "recent"]).default("price_asc"),
  limit: z.coerce.number().min(1).max(100).default(30),
});

export type SearchQueryDto = z.infer<typeof searchQuerySchema>;

export const compareSchema = z.object({
  items: z.array(z.object({
    id: z.string().optional(),
    title: z.string(),
    price: z.number(),
    platform: z.string(),
    url: z.string(),
    imageUrl: z.string().optional(),
    condition: z.string().optional(),
  })).min(2, "Selecione pelo menos 2 itens para comparar"),
});

export type CompareDto = z.infer<typeof compareSchema>;
