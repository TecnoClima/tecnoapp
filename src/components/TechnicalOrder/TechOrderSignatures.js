function SignatureSlot({ label, name }) {
  return (
    <div className="w-60 flex-grow text-center">
      <div className="min-h-20" />
      <div>{label}:</div>
      {!!name && <div className="h-6">{name}</div>}
    </div>
  );
}

export function TechOrderSignatures({ order }) {
  return (
    <div id="signatures" className="flex w-full border p-4">
      <SignatureSlot label="Aceptado por" name={order.supervisor?.name} />
      <SignatureSlot
        label="Validado por"
        name={order.tech?.planned?.requester}
      />
      <SignatureSlot label="Realizado por" name={order.responsible?.name} />
    </div>
  );
}
