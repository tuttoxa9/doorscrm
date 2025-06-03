"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ProductForm } from "@/components/products/product-form"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Search, Edit, Trash2, Star } from "lucide-react"
import { getProxiedImageUrl } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BulkDeleteDialog } from "@/components/data-management/bulk-delete-dialog"
import type { Product } from "@/lib/types/product"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, "products"))
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]

      setProducts(productsData)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить список товаров",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = (product: Product) => {
    setCurrentProduct(product)
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!productToDelete) return

    try {
      await deleteDoc(doc(db, "products", productToDelete))
      toast({
        title: "Успешно",
        description: "Товар был удален",
      })
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить товар",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const confirmDelete = (productId: string) => {
    setProductToDelete(productId)
    setIsDeleteDialogOpen(true)
  }

  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set(prev).add(imageUrl))
  }

  const filteredProducts = products.filter(
    (product) =>
      (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Товары</h1>
          <p className="text-muted-foreground">Управление товарами в каталоге</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => setBulkDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Очистить все
          </Button>
          <Button
            onClick={() => {
              setCurrentProduct(null)
              setIsDialogOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Добавить товар
          </Button>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск товаров..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Фото</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Цена (BYN)</TableHead>
                <TableHead>Цвета</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.images && product.images.length > 0 && !imageErrors.has(product.images[0]) ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-md">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getProxiedImageUrl(product.images[0])}
                            alt={product.name || "Товар"}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(product.images[0])}
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Нет</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.name || "Без названия"}</span>
                        {product.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      </div>
                    </TableCell>
                    <TableCell>{product.category || "Без категории"}</TableCell>
                    <TableCell>
                      {product.price && product.price.min !== undefined && product.price.max !== undefined
                        ? product.price.min === product.price.max
                          ? `${product.price.min.toLocaleString()} BYN`
                          : `${product.price.min.toLocaleString()} - ${product.price.max.toLocaleString()} BYN`
                        : "Цена не указана"
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.colors && product.colors.length > 0 ? (
                          <>
                            {product.colors.slice(0, 3).map((color, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {color}
                              </Badge>
                            ))}
                            {product.colors.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.colors.length - 3}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">Нет цветов</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`status-badge ${product.inStock !== undefined ? (product.inStock ? "status-badge-completed" : "status-badge-cancelled") : "status-badge-pending"}`}
                      >
                        {product.inStock !== undefined ? (product.inStock ? "В наличии" : "Нет в наличии") : "Неизвестно"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {searchQuery ? "Товары не найдены" : "Нет товаров"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle className="text-lg">{currentProduct ? "Редактировать товар" : "Добавить товар"}</DialogTitle>
            <DialogDescription className="text-sm">
              {currentProduct
                ? "Измените информацию о товаре и нажмите Сохранить"
                : "Заполните информацию о новом товаре"}
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            product={currentProduct}
            onSuccess={() => {
              setIsDialogOpen(false)
              fetchProducts()
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="modal-backdrop">
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Товар будет удален из базы данных.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <BulkDeleteDialog
        isOpen={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        collectionName="products"
        title="Удалить все товары"
        description="Это действие удалит все товары из каталога, включая их изображения."
        onSuccess={fetchProducts}
      />
    </div>
  )
}
