export interface Product {
  id: string | number;
  name: string;
  category?: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  tags: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Brigadeiro Trufado Gourmet',
    category: 'Doces',
    description: 'Tradicional doce brasileiro feito com o mais puro cacau e leite condensado premium. Um clássico irresistível para adoçar o seu dia a dia.',
    price: 8.5,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1765946024017-3995b2aa99eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBicmlnYWRlaXJvJTIwdHJ1ZmZsZXxlbnwxfHx8fDE3NzQ0NjkwMjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Mais Vendido'],
  },
  {
    id: 2,
    name: 'Fatia Torta de Morango',
    category: 'Tortas',
    description: 'Base crocante de biscoito, creme leve de baunilha e cobertura de morangos frescos. Uma explosão de sabores frescos e doces que encanta todos os paladares.',
    price: 18.9,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1769655103034-6a8abfa7523b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhd2JlcnJ5JTIwc2hvcnRjYWtlJTIwc2xpY2V8ZW58MXx8fHwxNzc0NDI0OTkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Novo'],
  },
  {
    id: 3,
    name: 'Caixa de Macarons Sortidos',
    category: 'Especiais',
    description: 'Delicados biscoitos franceses à base de farinha de amêndoas, recheados com ganaches variadas. Perfeito para presentear ou saborear.',
    price: 45.0,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1681589211939-cbb7402afbc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMG1hY2Fyb25zfGVufDF8fHx8MTc3NDQyMTc3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Premium'],
  },
  {
    id: 4,
    name: 'Bolo de Chocolate Intenso',
    category: 'Bolos',
    description: 'Bolo super macio com duas camadas de recheio de brigadeiro meio amargo e cobertura de ganache. Para os amantes de chocolate de verdade.',
    price: 110.0,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1718584560193-4516c328604a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBkaXNwbGF5JTIwaGVybyUyMGJhbm5lcnxlbnwxfHx8fDE3NzQ0NjkwMzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Encomenda'],
  },
  {
    id: 5,
    name: 'Croissant Recheado de Nutella',
    category: 'Doces',
    description: 'Massa folhada incrivelmente crocante por fora e macia por dentro, recheada com muito creme de avelã.',
    price: 15.0,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1767005549428-90b2e2750891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFzb25hbCUyMHBhc3RyeSUyMGJha2VyeXxlbnwxfHx8fDE3NzQ0NzAxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Sucesso'],
  },
];
