export default async function GatheringDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">게더링 상세</h1>
      <p className="text-tag-text">게더링 ID: {id}</p>
    </div>
  )
}
