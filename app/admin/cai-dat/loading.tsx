import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SettingsLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general" disabled>
            <Skeleton className="h-4 w-24" />
          </TabsTrigger>
          <TabsTrigger value="email" disabled>
            <Skeleton className="h-4 w-24" />
          </TabsTrigger>
          <TabsTrigger value="attendance" disabled>
            <Skeleton className="h-4 w-24" />
          </TabsTrigger>
          <TabsTrigger value="security" disabled>
            <Skeleton className="h-4 w-24" />
          </TabsTrigger>
          <TabsTrigger value="backup" disabled>
            <Skeleton className="h-4 w-24" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
