import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SearchHistoryItem, getSearchHistory, removeFromSearchHistory, clearSearchHistory } from "@/lib/search-history";
import { useColors } from "@/hooks/use-colors";

export interface SearchHistoryDisplayProps {
  onSelectSearch: (query: string) => void;
}

export function SearchHistoryDisplay({
  onSelectSearch,
}: SearchHistoryDisplayProps) {
  const colors = useColors();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getSearchHistory();
      setHistory(data);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (query: string) => {
    await removeFromSearchHistory(query);
    await loadHistory();
  };

  const handleClearAll = async () => {
    await clearSearchHistory();
    setHistory([]);
  };

  if (loading) {
    return (
      <View className="p-4">
        <Text className="text-sm text-muted">Carregando histórico...</Text>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View className="p-4">
        <Text className="text-sm text-muted">Nenhuma busca recente</Text>
      </View>
    );
  }

  return (
    <View className="bg-surface rounded-lg p-4 mb-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-sm font-semibold text-foreground">
          Buscas Recentes
        </Text>
        <Pressable
          onPress={handleClearAll}
          style={({ pressed }) => [pressed && { opacity: 0.6 }]}
        >
          <Text className="text-xs text-primary font-semibold">Limpar</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {history.map((item, index) => (
          <View key={index} className="mb-2">
            <View className="flex-row justify-between items-center bg-background rounded-lg p-3 border border-border">
              <Pressable
                onPress={() => onSelectSearch(item.query)}
                className="flex-1"
                style={({ pressed }) => [pressed && { opacity: 0.6 }]}
              >
                <View>
                  <Text className="text-sm font-semibold text-foreground">
                    {item.query}
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    {item.resultCount} resultado(s)
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => handleRemoveItem(item.query)}
                className="ml-2 p-2"
                style={({ pressed }) => [pressed && { opacity: 0.6 }]}
              >
                <Text className="text-lg text-muted">✕</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
