import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package2, ShoppingBag, Users2, Images } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    products: number
    orders: number
    users: number
    gallery: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Товары</CardTitle>
          <Package2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.products}</div>
          <p className="text-xs text-muted-foreground">Всего товаров в каталоге</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Заказы</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.orders}</div>
          <p className="text-xs text-muted-foreground">Всего заказов с сайта</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
          <Users2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.users}</div>
          <p className="text-xs text-muted-foreground">Администраторов и менеджеров</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Галерея</CardTitle>
          <Images className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.gallery}</div>
          <p className="text-xs text-muted-foreground">Работ в галерее</p>
        </CardContent>
      </Card>
    </div>
  )
}
