export default function CategoriaPage({ params }) {
    const { categoriaId } = params;

    return (
        <div>
            <h1>Cardápio da Categoria: {categoriaId.toUpperCase()}</h1>
        </div>
    );
}