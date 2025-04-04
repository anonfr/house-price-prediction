import PredictionForm from "@/components/prediction-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Indian House Price Predictor</h1>
        <p className="text-muted-foreground text-center mb-8">
          Enter your house details to get an estimated price in INR and future value prediction
        </p>

        <Card>
          <CardHeader>
            <CardTitle>House Details</CardTitle>
            <CardDescription>Fill in the details about the property to get an accurate prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <PredictionForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

