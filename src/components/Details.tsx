import { Card } from "./Card";

export const Details: React.FC<{
  categorySelected?: string;
}> = ({ categorySelected }) => {
  return (
    <Card title="Detalles">
      <p className="text-gray-400">
        {categorySelected
          ? `Has seleccionado ${categorySelected}`
          : `Seleccione una categoria para modificar o agregar detalles`}
      </p>
    </Card>
  );
};
