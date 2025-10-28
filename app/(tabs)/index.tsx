import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/assets/logo';
import { api } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';

export default function HomeScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/api/inmuebles');
        const data = res.data?.data?.items || [];
        setItems(data);
      } catch (e: any) {
        setError('No se pudieron cargar los inmuebles');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        <Logo size={20}/>
        <Text className="text-white font-semibold text-lg">RentaYa</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-4 py-4">
          <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2">
            <Ionicons name="search-outline" size={18} color="#6B7280" />
            <TextInput placeholder="Buscar" className="flex-1 px-2 py-1" />
            <Pressable className="ml-2 p-2">
              <Ionicons name="options-outline" size={18} color="#11181C" />
            </Pressable>
          </View>

          {loading && (
            <View className="mt-6 items-center justify-center">
              <ActivityIndicator />
              <Text className="text-gray-500 mt-2">Cargando inmuebles...</Text>
            </View>
          )}

          {error && !loading && (
            <View className="mt-6 items-center justify-center">
              <Text className="text-red-500">{error}</Text>
            </View>
          )}

          {!loading && !error && (
            <View className="mt-4 flex-row flex-wrap justify-between">
              {items.map((it: any) => {
                const firstPhoto = (it.fotosInmueble && it.fotosInmueble.length > 0) ? it.fotosInmueble[0].url : undefined;
                const priceText = it.precio ? `Bs ${it.precio}` : '—';
                return (
                  <PropertyCard
                    key={it.id}
                    title={it.titulo}
                    imageUrl={firstPhoto}
                    price={priceText}
                    tipo={it.tipoOperacion}
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
