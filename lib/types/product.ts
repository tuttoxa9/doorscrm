export interface Product {
  id: string
  name: string // Название товара
  category: string // Категория (вводится вручную)
  price: { min: number; max: number } // Ценовой диапазон (BYN)
  description: string // Описание
  colors: string[] // Доступные цвета
  images: string[] // Изображения (Firebase Storage)
  inStock: boolean // Наличие
  featured: boolean // Популярный товар
  createdAt: Date
  updatedAt: Date
}

export const DEFAULT_COLORS = [
  "Белый",
  "Черный",
  "Коричневый",
  "Серый",
  "Бежевый",
  "Орех",
  "Дуб",
  "Венге",
  "Махагон",
  "Вишня",
]
