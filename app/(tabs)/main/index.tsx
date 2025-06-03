import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
export default function MTGTrackerScreen() {
  const router = useRouter();
  type RoutePath = Parameters<typeof router.push>[0];

  const handleNavigate = (path: RoutePath) => {
    router.push(path);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MTG</Text>
        <Text style={styles.title}>Tracker</Text>
        <Ionicons name="dice-outline" size={240} color="white" />
      </View>

      <View style={styles.grid}>
        <Pressable
          style={styles.button}
          onPress={() => handleNavigate('/tracker')}
        >
          <Text style={styles.buttonText}>Tracker</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => handleNavigate('/search')}
        >
          <Text style={styles.buttonText}>Search</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222', // ciemne tło
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 64,
    fontWeight: '400',
    marginBottom: '-5%',
    marginTop: 8,
    textAlign: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: '100%',
    gap: 10,
    backgroundColor: '#333',
    height: '52%',
    paddingVertical: '10%',
    borderTopWidth: 2,
  },
  button: {
    width: '45%',
    height: '45%',
    backgroundColor: '#111',
    paddingVertical: '15%',
    marginBottom: 8,
    borderRadius: 8,
    borderColor: '#7F7FFF',
    borderWidth: 1,
    alignItems: 'center',
    alignContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
});
