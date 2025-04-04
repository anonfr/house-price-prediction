"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Home, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { predictHousePrice } from "@/lib/prediction"

const formSchema = z.object({
  bedrooms: z.coerce.number().min(1, "Must have at least 1 bedroom").max(10, "Maximum 10 bedrooms"),
  bathrooms: z.coerce.number().min(1, "Must have at least 1 bathroom").max(10, "Maximum 10 bathrooms"),
  floors: z.coerce.number().min(1, "Must have at least 1 floor").max(5, "Maximum 5 floors"),
  yearBuilt: z.coerce
    .number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  squareFeet: z.coerce.number().min(500, "Minimum 500 sq ft").max(10000, "Maximum 10,000 sq ft"),
  location: z.string().min(1, "Please select a location"),
  futureYears: z.coerce.number().min(1, "Minimum 1 year").max(100, "Maximum 100 years"),
})

type FormValues = z.infer<typeof formSchema>

export default function PredictionForm() {
  const [prediction, setPrediction] = useState<{
    currentPrice: number
    futurePrice: number
    futureYears: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bedrooms: 3,
      bathrooms: 2,
      floors: 1,
      yearBuilt: 2000,
      squareFeet: 1500,
      location: "",
      futureYears: 5,
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    try {
      const result = await predictHousePrice(data)
      setPrediction(result)
    } catch (error) {
      console.error("Prediction error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Format price in Indian format (lakhs and crores)
  const formatIndianPrice = (price: number) => {
    if (price >= 10000000) {
      // Convert to crores if >= 1 crore
      const crores = (price / 10000000).toFixed(2)
      return `₹${crores} Cr`
    } else if (price >= 100000) {
      // Convert to lakhs if >= 1 lakh
      const lakhs = (price / 100000).toFixed(2)
      return `₹${lakhs} L`
    } else {
      // Regular formatting for smaller amounts
      return `₹${price.toLocaleString("en-IN")}`
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2" step="0.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floors</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearBuilt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Built</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="squareFeet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Square Feet</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="urban">Urban</SelectItem>
                      <SelectItem value="suburban">Suburban</SelectItem>
                      <SelectItem value="rural">Rural</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="futureYears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Future Prediction (Years): {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={100}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormDescription>Adjust to predict property value from 1 to 100 years in the future</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Calculating..." : "Predict Price"}
          </Button>
        </form>
      </Form>

      {prediction && (
        <Tabs defaultValue="current">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Estimate</TabsTrigger>
            <TabsTrigger value="future">Future Value</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Home className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Current Estimated Value</h3>
                  </div>
                  <p className="text-2xl font-bold">{formatIndianPrice(prediction.currentPrice)}</p>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  This estimate is based on current market conditions and similar properties in the area.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="future">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-medium">{prediction.futureYears}-Year Projected Value</h3>
                  </div>
                  <p className="text-2xl font-bold">{formatIndianPrice(prediction.futurePrice)}</p>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  This projection is based on historical appreciation rates and market trends in the selected area.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

