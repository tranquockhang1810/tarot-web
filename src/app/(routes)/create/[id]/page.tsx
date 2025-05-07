import CardView from "@/components/screens/cards/view/CardView"

export default async function cards({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <CardView id={id}/>
}
