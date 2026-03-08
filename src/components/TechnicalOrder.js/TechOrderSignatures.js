export function TechOrderSignatures({ order }) {
  const { acceptedBy, validatedBy, realizedBy } = order;
  return (
    <div className="flex w-full border p-4">
      <div className="w-60 flex-grow text-center">
        <div className="min-h-20" />
        <div>Aceptado por:</div>
        {!!acceptedBy && <div className="h-6">{acceptedBy.name}</div>}
      </div>
      <div className="w-60 flex-grow text-center">
        <div className="min-h-20" />
        <div>Validado por:</div>
        {!!validatedBy && <div className="h-6">{validatedBy.name}</div>}
      </div>
      <div className="w-60 flex-grow text-center">
        <div className="min-h-20" />
        <div>Realizado por: </div>
        {!!realizedBy && <div className="h-6">{realizedBy.name}</div>}
      </div>
    </div>
  );
}
