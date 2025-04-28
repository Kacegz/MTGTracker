import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
export default function MTGTrackerScreen() {
        const router = useRouter();
          const handleNavigate = (path: string) => {
            router.push(path);
          };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MTG Tracker</Text>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.grid}>

                <Pressable style={styles.button} onPress={() => handleNavigate('/tracker')}>
          <Text style={styles.buttonText}>Tracker</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => handleNavigate('/search')}>
          <Text style={styles.buttonText}>Search</Text>
                </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // ciemne tło
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logo: {
    width: 64,
    height: 64,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    paddingVertical: 20,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: '#7F7FFF',
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
