import { useEffect, useState } from "react";
import { View, Text, Button, TextInput, Alert, StyleSheet } from "react-native";
import { useProductDatabase, ProductDatabase } from "../../database/useProductDatabase";
import { useRoute } from "@react-navigation/native";

// Define a type for route parameters
type RouteParams = {
  id: string;
};

const calculateCost = (carroceria: string, eletrico: boolean, hours: number) => {
  // Define the costs
  const firstHourCosts: { [key: string]: number } = {
    "Sub Compacto": 2,
    "Compacto": 3,
    "Hatch": 5,
    "SUV": 5,
    "Sedan":5,
    "Pickup": 7,
  };

  const firstHourCost = firstHourCosts[carroceria] || 0;
  const discountedFirstHourCost = eletrico ? firstHourCost / 2 : firstHourCost;
  const additionalHourCost = 2;

  // Calculate the total cost
  const totalCost = hours > 1 
    ? discountedFirstHourCost + (hours - 1) * additionalHourCost
    : discountedFirstHourCost;

  return totalCost;
};

export default function Details() {
  const [product, setProduct] = useState<ProductDatabase | null>(null);
  const [hours, setHours] = useState<string>("1"); // Default to 1 hour
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const route = useRoute();
  const params = route.params as RouteParams; // Type assertion
  const productId = params.id;
  const productDatabase = useProductDatabase();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productDatabase.show(Number(productId));
        if (response) {
          setProduct(response);
        } else {
          Alert.alert("Erro", "Nenhuma informação encontrada para o carro.");
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Erro", "Não foi possível carregar as informações do carro.");
      }
    };
  
    fetchProduct();
  }, [productId]);
  

  const handleCalculateCost = () => {
    const hoursNumber = parseInt(hours);
    if (isNaN(hoursNumber) || hoursNumber <= 0) {
      Alert.alert("Erro", "Por favor, insira um número de horas válido.");
      return;
    }

    if (product) {
      const cost = calculateCost(product.carroceria, product.eletrico === 1, hoursNumber);
      setCalculatedCost(cost);
    }
  };

  return (
    <View style={styles.container}>
      {product ? (
        <>
          <Text style={styles.title}>Detalhes do Carro</Text>
          <Text>Modelo: {product.modelo}</Text>
          <Text>Marca: {product.marca}</Text>
          <Text>Placa: {product.placa}</Text>
          <Text>Carroceria: {product.carroceria}</Text>
          <Text>Elétrico: {product.eletrico === 1 ? "Sim" : "Não"}</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite o número de horas"
            keyboardType="numeric"
            value={hours}
            onChangeText={setHours}
          />

          <Button title="Calcular Custo" onPress={handleCalculateCost} />

          {calculatedCost !== null && (
            <Text style={styles.result}>O custo total para {hours} horas é R$ {calculatedCost.toFixed(2)}</Text>
          )}
        </>
      ) : (
        <Text>Carregando informações do carro...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 7,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  result: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
});
