import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { PlanTemplate } from "@/lib/plan-templates";
import {
  searchPlanTemplates,
  getSearchSuggestions,
  SearchResult,
} from "@/lib/plan-search";
import { IconSymbol } from "./ui/icon-symbol";
import * as Haptics from "expo-haptics";

interface PlanSearchModalProps {
  templates: PlanTemplate[];
  onSelectTemplate: (template: PlanTemplate) => void;
  onClose: () => void;
}

export function PlanSearchModal({
  templates,
  onSelectTemplate,
  onClose,
}: PlanSearchModalProps) {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    if (searchQuery.trim()) {
      // Realizar busca
      const results = searchPlanTemplates(templates, searchQuery);
      setSearchResults(results);
      setShowSuggestions(false);

      // Atualizar sugestões
      const newSuggestions = getSearchSuggestions(searchQuery);
      setSuggestions(newSuggestions);
    } else {
      // Mostrar todas as sugestões quando vazio
      setSearchResults([]);
      setSuggestions(getSearchSuggestions(""));
      setShowSuggestions(true);
    }
  }, [searchQuery, templates]);

  const handleSelectTemplate = (template: PlanTemplate) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onSelectTemplate(template);
  };

  const handleSuggestionPress = (suggestion: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSearchQuery(suggestion);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(true);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 16,
      }}
    >
      {/* Cabeçalho com campo de busca */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.foreground,
            }}
          >
            Buscar Plano
          </Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={{ fontSize: 24, color: colors.foreground }}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Campo de busca */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: colors.border,
            gap: 8,
          }}
        >
          <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
          <TextInput
            placeholder="Afasia, Broca, Linguagem..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              paddingVertical: 12,
              fontSize: 14,
              color: colors.foreground,
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} activeOpacity={0.7}>
              <Text style={{ fontSize: 18, color: colors.muted }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 24, gap: 16 }}
      >
        {showSuggestions && suggestions.length > 0 && (
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.muted,
                textTransform: "uppercase",
              }}
            >
              Sugestões Populares
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {suggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  onPress={() => handleSuggestionPress(suggestion)}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: colors.primary + "20",
                    borderWidth: 1,
                    borderColor: colors.primary,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "500",
                      color: colors.primary,
                    }}
                  >
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Resultados de busca */}
        {searchQuery.trim() && (
          <View style={{ gap: 12 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.muted,
                  textTransform: "uppercase",
                }}
              >
                Resultados ({searchResults.length})
              </Text>
            </View>

            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <TouchableOpacity
                  key={result.template.id}
                  onPress={() => handleSelectTemplate(result.template)}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: colors.foreground,
                        }}
                      >
                        {result.template.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.muted,
                          lineHeight: 18,
                        }}
                        numberOfLines={2}
                      >
                        {result.template.objective}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: colors.primary + "20",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "600",
                          color: colors.primary,
                        }}
                      >
                        {result.matchScore}%
                      </Text>
                    </View>
                  </View>

                  {/* Regiões e pontos */}
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {result.template.targetRegions.slice(0, 2).map((region) => (
                      <View
                        key={region}
                        style={{
                          backgroundColor: colors.primary + "10",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: colors.primary,
                            fontWeight: "500",
                          }}
                        >
                          {region}
                        </Text>
                      </View>
                    ))}
                    {result.template.targetRegions.length > 2 && (
                      <View
                        style={{
                          backgroundColor: colors.muted + "20",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: colors.muted,
                            fontWeight: "500",
                          }}
                        >
                          +{result.template.targetRegions.length - 2}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Tipo de match */}
                  <Text
                    style={{
                      fontSize: 11,
                      color: colors.muted,
                      marginTop: 4,
                    }}
                  >
                    Encontrado em: <Text style={{ fontWeight: "600" }}>{result.matchType}</Text>
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 32,
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.muted,
                    textAlign: "center",
                  }}
                >
                  Nenhum plano encontrado para "{searchQuery}"
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.muted,
                    textAlign: "center",
                  }}
                >
                  Tente outras palavras-chave
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Lista de todos os templates quando não há busca */}
        {!searchQuery.trim() && (
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.muted,
                textTransform: "uppercase",
              }}
            >
              Todos os Planos ({templates.length})
            </Text>
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                onPress={() => handleSelectTemplate(template)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.foreground,
                  }}
                >
                  {template.name}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.muted,
                    lineHeight: 18,
                  }}
                  numberOfLines={2}
                >
                  {template.objective}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
