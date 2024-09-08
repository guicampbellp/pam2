import { Pressable, PressableProps, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Props = PressableProps & {
  data: {
    modelo: string;
    marca: string;
    placa: string;
    carroceria: string;
    eletrico: number;
  };
  onDelete: () => void;
  onUpdate: () => void;
  onOpen: () => void;
};

export function Product({ data, onDelete, onUpdate, onOpen, ...rest }: Props) {
  return (
    <Pressable style={styles.container} {...rest}>
      <View style={styles.placaContainer}>
        <Text style={styles.placaText}>{data.placa}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Modelo: {data.modelo}</Text>
        <Text style={styles.infoText}>Marca: {data.marca}</Text>
        <Text style={styles.infoText}>Carroceria: {data.carroceria}</Text>
        <Text style={styles.infoText}>Elétrico: {data.eletrico ? "Sim" : "Não"}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onUpdate} style={styles.button}>
          <MaterialIcons name="edit" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.button}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onOpen} style={styles.button}>
          <MaterialIcons name="visibility" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#CECECE",
    padding: 16,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  placaContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 8,
    marginRight: 16,
    borderColor: "#000",
    borderWidth: 1,
    width: 120,
    alignItems: "center",
  },
  placaText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginLeft: 8,
  },
});