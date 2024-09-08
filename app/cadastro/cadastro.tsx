import { useEffect, useState } from "react";
import { View, Button, Alert, FlatList, Text } from "react-native";
import { Input } from "../components/input";
import { Product } from "../components/product";
import { useProductDatabase, ProductDatabase } from "../database/useProductDatabase";
import { CheckBox } from "react-native-elements"; // Usando o checkbox
import { Picker } from '@react-native-picker/picker'; // Importando o Picker
import { useNavigation } from '@react-navigation/native'; // Para navegação
import {router} from "expo-router"

export default function Index() {
  const [id, setId] = useState("");
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [placa, setPlaca] = useState("");
  const [carroceria, setCarroceria] = useState(""); // Valor inicial vazio
  const [eletrico, setEletrico] = useState(false); // Mudança para booleano
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<ProductDatabase[]>([]);
  

  const productDatabase = useProductDatabase();

  // Função para validar e formatar a placa
  function handlePlacaChange(text: string) {
    let newText = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (newText.length > 7) {
      newText = newText.substring(0, 7);
    }

    const mercosulPattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    const normalPattern = /^[A-Z]{3}[0-9]{4}$/;

    if (newText.length === 7 && !mercosulPattern.test(newText) && !normalPattern.test(newText)) {
      Alert.alert("Formato inválido", "A placa deve ser no formato XXX1234 ou XXX1X23.");
      return;
    }

    setPlaca(newText);
  }

  async function create() {
    try {
      const response = await productDatabase.create({
        modelo,
        marca,
        placa,
        carroceria,
        eletrico: eletrico ? 1 : 0 // Convertendo booleano para 0 ou 1
      });

      Alert.alert("Carro cadastrado com o ID: " + response.insertedRowId);
      await list();
    } catch (error) {
      console.log(error);
    }
  }

  async function update() {
    try {
      const response = await productDatabase.update({
        id: Number(id),
        modelo,
        marca,
        placa,
        carroceria,
        eletrico: eletrico ? 1 : 0 // Convertendo booleano para 0 ou 1
      });

      Alert.alert("Carro atualizado!");
      await list();
    } catch (error) {
      console.log(error);
    }
  }

  async function list() {
    try {
      const response = await productDatabase.searchByName(search);
      setProducts(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function remove(id: number) {
    try {
      await productDatabase.remove(id);
      await list();
    } catch (error) {
      console.log(error);
    }
  }

  function handleUpdate(item: ProductDatabase) {
    setId(String(item.id));
    setModelo(item.modelo);
    setMarca(item.marca);
    setPlaca(item.placa);
    setCarroceria(item.carroceria);
    setEletrico(item.eletrico === 1); // Converte 1 para true (elétrico) e 0 para false
  }

  async function handleSave() {
    if (id) {
      await update();
    } else {
      await create();
    }

    setId("");
    setModelo("");
    setMarca("");
    setPlaca("");
    setCarroceria(""); // Reseta o Picker para valor vazio
    setEletrico(false); // Reseta o checkbox
  }

  useEffect(() => {
    list();
  }, [search]);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 32, gap: 16 }}>
      <Input placeholder="Modelo" onChangeText={setModelo} value={modelo} />
      <Input placeholder="Marca" onChangeText={setMarca} value={marca} />
      <Input
        placeholder="Placa"
        onChangeText={handlePlacaChange}
        value={placa}
      />

      {/* Picker para o campo carroceria com opção de valor nulo */}
      <Picker
        selectedValue={carroceria}
        onValueChange={(itemValue) => setCarroceria(itemValue)}
        style={{ height: 50, width: '100%' }}
      >
        <Picker.Item label="Selecione uma carroceria" value="" />
        <Picker.Item label="Sub Compacto" value="Sub Compacto" />
        <Picker.Item label="Compacto" value="Compacto" />
        <Picker.Item label="Sedan" value="Sedan" />
        <Picker.Item label="Hatch" value="Hatch" />
        <Picker.Item label="SUV" value="SUV" />
        <Picker.Item label="Pickup" value="Pickup" />
        
      </Picker>

      {/* Checkbox para o campo elétrico */}
      <CheckBox
        title="Carro Elétrico"
        checked={eletrico}
        onPress={() => setEletrico(!eletrico)} // Alterna entre true e false
      />

      <Button title="Salvar" onPress={handleSave} />

      <Input placeholder="Pesquisar" onChangeText={setSearch} />

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Product
            data={item}
            onUpdate={() => handleUpdate(item)}
            onDelete={() => remove(item.id)}
            onOpen={() => router.navigate("./details/" + item.id)}
          />
        )}
        contentContainerStyle={{ gap: 16 }}
      />
    </View>
  );
}