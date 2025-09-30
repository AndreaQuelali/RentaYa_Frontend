import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { ThemedView } from '@/components/themed-view'
import { ThemedText } from '@/components/themed-text'

export default function index() {
  return (
    <ThemedView>
      <Stack.Screen options={{ title: 'Settings' }} />
      <ThemedText className='font-bold text-lg'>index</ThemedText>
    </ThemedView>
  )
}