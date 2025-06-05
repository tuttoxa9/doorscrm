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
import Image from "next/image"
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
  }, [])

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

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Товары</h1>
          <p className="text-sm text-muted-foreground">Управление товарами в каталоге</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => setBulkDeleteOpen(true)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Очистить все
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setCurrentProduct(null)
              setIsDialogOpen(true)
            }}
          >
            <Plus className="mr-1 h-3 w-3" /> Добавить товар
          </Button>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск товаров..."
            className="pl-7 h-8 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] py-2">Фото</TableHead>
                <TableHead className="py-2">Название</TableHead>
                <TableHead className="py-2">Категория</TableHead>
                <TableHead className="py-2">Цена (BYN)</TableHead>
                <TableHead className="py-2">Цвета</TableHead>
                <TableHead className="py-2">Статус</TableHead>
                <TableHead className="text-right py-2">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="py-2">
                      {product.images && product.images.length > 0 ? (
                        <div className="relative h-8 w-8 overflow-hidden rounded-md">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Нет</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm">{product.name}</span>
                        {product.featured && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm">{product.category}</TableCell>
                    <TableCell className="py-2 text-sm">
                      {product.price?.min === product.price?.max
                        ? `${product.price.min.toLocaleString()} BYN`
                        : `${product.price?.min?.toLocaleString()} - ${product.price?.max?.toLocaleString()} BYN`}
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex flex-wrap gap-1">
                        {product.colors?.slice(0, 2).map((color, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                            {color}
                          </Badge>
                        ))}
                        {product.colors && product.colors.length > 2 && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            +{product.colors.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <span
                        className={`status-badge text-xs ${product.inStock ? "status-badge-completed" : "status-badge-cancelled"}`}
                      >
                        {product.inStock ? "В наличии" : "Нет в наличии"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => confirmDelete(product.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-16 text-center text-sm">
                    {searchQuery ? "Товары не найдены" : "Нет товаров"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-background max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">{currentProduct ? "Редактировать товар" : "Добавить товар"}</DialogTitle>
            <DialogDescription className="text-xs">
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
