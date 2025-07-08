import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import stitchKeychain from "@/assets/stitch-keychain.jpg";
import toothlessKeychain from "@/assets/toothless-keychain.jpg";
import bt21Keychain from "@/assets/bt21-keychain.jpg";
import pokemonKeychain from "@/assets/pokemon-keychain.jpg";

// Temporary image mapping for demo
const imageMap: { [key: string]: string } = {
  'stitch-classic': stitchKeychain,
  'toothless-night-fury': toothlessKeychain,
  'koya-bear-bt21': bt21Keychain,
  'pikachu-classic': pokemonKeychain,
};

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  category: {
    name: string;
    color_theme: string;
  };
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          short_description,
          price,
          sale_price,
          stock_quantity,
          categories:category_id (
            name,
            color_theme
          )
        `)
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(8);

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      // Transform data to match our interface
      const transformedProducts = data?.map(product => ({
        ...product,
        category: product.categories
      })) || [];

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Produtos em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-64 bg-muted rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-6 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">Produtos em Destaque</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubra os chaveiros mais queridos pelos nossos clientes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="group hover:shadow-hover transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={imageMap[product.slug] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Category badge */}
                <Badge 
                  className="absolute top-3 left-3 font-semibold"
                  style={{ backgroundColor: product.category?.color_theme }}
                >
                  {product.category?.name}
                </Badge>

                {/* Sale badge */}
                {product.sale_price && (
                  <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                    OFERTA
                  </Badge>
                )}

                {/* Action buttons */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
                  <Button size="icon" variant="outline" className="bg-white/90 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {product.short_description}
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  {product.sale_price ? (
                    <>
                      <span className="text-xl font-bold text-sale-price">
                        {formatPrice(product.sale_price)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-price">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {product.stock_quantity < 10 && (
                  <p className="text-warning text-sm font-medium">
                    Apenas {product.stock_quantity} disponíveis!
                  </p>
                )}
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button 
                  asChild
                  variant="accent" 
                  className="w-full"
                  disabled={product.stock_quantity === 0}
                >
                  <Link to={`/produto/${product.slug}`}>
                    {product.stock_quantity === 0 ? 'Esgotado' : 'Ver Produto'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="accent" size="lg">
            Ver Todos os Produtos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;