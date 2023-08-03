export default function Instructions() {
  return (
    <>
      {" "}
      <p>
        El archivo a cargar debe cumplir con ciertos requisitos para que la
        carga sea exitosa.
      </p>
      <li>
        <b>Archivo:</b> El archivo de excel debe tener una hoja con una sola
        tabla
      </li>
      <li>
        <b>Campos:</b> La tabla debe poseer todos los campos. Es recomendable
        descargar la plantilla
      </li>
      <li>
        <b>Datos vacíos:</b> El sistema no asume nada. Todos los datos deben ser
        cargados. El único dato opcional es "descripción larga".
      </li>
      <li>
        <b>Códigos:</b> Todos los códigos son únicos. El sistema no distingue el
        código OFI de dos áreas o plantas diferentes. Y como el código pertenece
        a una única línea, éste debe ser único al momento de crearlo. Una vez
        utilizado el código, no podrá utilizarse para otra línea de otra planta.
      </li>
      <li>
        <b>Ubicación:</b> Las plantas, áreas, líneas y lugares de servicio deben
        completarse con su nombre, no con el código. Y tiene que ser el nombre
        correcto. Para ello, se puede filtrar en los ejemplos, para encontrar el
        nombre correcto, y luego copiarlo y pegarlo en la tabla.
      </li>
      <li>
        <b>Lugares de Servicio:</b> Si el lugar de servicio indicado no existe,
        tendrás la posibilidad de confirmar si quieres darlo de alta. Lee
        atentamente antes de crearlo. Una vez utilizados en las órdenes de
        trabajo, cambiarlos demandará mucho trabajo. El sistema asignará el
        primer código de lugar de servicio disponible para esa línea. Los
        códigos de lugar de servicio deben tener la forma{" "}
        <b>[Código de línea]-LS[número secuencial]</b>, por ejemplo:{" "}
        <b>CC1-LS001</b>
      </li>
      <li>
        <b>Código de Equipos:</b> Si falta un código de equipo, el sistema le
        asignará el que esté inmediatamente disponible para esa línea. Por
        ejemplo, si el último equipo registrado para la línea CC1 es CC1-012, a
        un nuevo equipo en esa línea se le asignará el CC1-013
      </li>
    </>
  );
}
