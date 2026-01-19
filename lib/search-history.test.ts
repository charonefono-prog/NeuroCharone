import { describe, it, expect, beforeEach, afterEach } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addToSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  removeFromSearchHistory,
} from "./search-history";

describe("Search History", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  afterEach(async () => {
    await AsyncStorage.clear();
  });

  it("deve adicionar uma busca ao histórico", async () => {
    await addToSearchHistory("Afasia", 3);
    const history = await getSearchHistory();

    expect(history).toHaveLength(1);
    expect(history[0].query).toBe("Afasia");
    expect(history[0].resultCount).toBe(3);
  });

  it("deve retornar histórico vazio inicialmente", async () => {
    const history = await getSearchHistory();
    expect(history).toHaveLength(0);
  });

  it("deve manter apenas os últimos 5 itens", async () => {
    for (let i = 1; i <= 7; i++) {
      await addToSearchHistory(`Busca ${i}`, i);
    }

    const history = await getSearchHistory();
    expect(history).toHaveLength(5);
    expect(history[0].query).toBe("Busca 7");
  });

  it("deve remover duplicatas mantendo a mais recente", async () => {
    await addToSearchHistory("Afasia", 3);
    await addToSearchHistory("Zumbido", 2);
    await addToSearchHistory("Afasia", 5);

    const history = await getSearchHistory();
    expect(history).toHaveLength(2);
    expect(history[0].query).toBe("Afasia");
    expect(history[0].resultCount).toBe(5);
  });

  it("deve limpar o histórico", async () => {
    await addToSearchHistory("Afasia", 3);
    await addToSearchHistory("Zumbido", 2);

    await clearSearchHistory();
    const history = await getSearchHistory();

    expect(history).toHaveLength(0);
  });

  it("deve remover um item específico do histórico", async () => {
    await addToSearchHistory("Afasia", 3);
    await addToSearchHistory("Zumbido", 2);
    await addToSearchHistory("Parkinson", 1);

    await removeFromSearchHistory("Zumbido");
    const history = await getSearchHistory();

    expect(history).toHaveLength(2);
    expect(history.map((h) => h.query)).not.toContain("Zumbido");
  });

  it("deve manter timestamp ao adicionar busca", async () => {
    const beforeTime = Date.now();
    await addToSearchHistory("Afasia", 3);
    const afterTime = Date.now();

    const history = await getSearchHistory();
    expect(history[0].timestamp).toBeGreaterThanOrEqual(beforeTime);
    expect(history[0].timestamp).toBeLessThanOrEqual(afterTime);
  });
});
