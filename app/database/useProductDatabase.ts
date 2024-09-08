import { useSQLiteContext } from "expo-sqlite"

export type ProductDatabase = {
  id: number
  modelo: string
  marca: string
  placa: string
  carroceria: string
  eletrico: number
}

export function useProductDatabase() {
  const database = useSQLiteContext()

  async function create(data: Omit<ProductDatabase, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO products (modelo, marca, placa, carroceria, eletrico) VALUES ($modelo, $marca, $placa, $carroceria, $eletrico)"
    )

    try {
      const result = await statement.executeAsync({
        $modelo: data.modelo,
        $marca: data.marca,
        $placa: data.placa,
        $carroceria: data.carroceria,
        $eletrico: data.eletrico,
      })

      const insertedRowId = result.lastInsertRowId.toLocaleString()

      return { insertedRowId }
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function searchByName(placa: string) {
    try {
      const query = "SELECT * FROM products WHERE placa LIKE ?"
      const response = await database.getAllAsync<ProductDatabase>(query, `%${placa}%`)
      return response
    } catch (error) {
      throw error
    }
  }

  async function update(data: ProductDatabase) {
    const statement = await database.prepareAsync(
      "UPDATE products SET modelo = $modelo, marca = $marca, placa = $placa, carroceria = $carroceria, eletrico = $eletrico WHERE id = $id"
    )

    try {
      await statement.executeAsync({
        $id: data.id,
        $modelo: data.modelo,
        $marca: data.marca,
        $placa: data.placa,
        $carroceria: data.carroceria,
        $eletrico: data.eletrico,
      })
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function remove(id: number) {
    try {
      await database.execAsync("DELETE FROM products WHERE id = " + id)
    } catch (error) {
      throw error
    }
  }

  async function show(id: number) {
    try {
      const query = "SELECT * FROM products WHERE id = ?"
      const response = await database.getFirstAsync<ProductDatabase>(query, [id])
      return response
    } catch (error) {
      throw error
    }
  }

  return { create, searchByName, update, remove, show }
}