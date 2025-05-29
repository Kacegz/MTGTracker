import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const COUNTER_TYPES = [
  { key: 'generic', label: 'GENERIC' },
  { key: 'energy', label: 'ENERGY' },
  { key: 'poison', label: 'POISON' },
  { key: 'experience', label: 'EXPERIENCE' },
  { key: 'elderRing', label: 'ELDER RING' },
  { key: 'storm', label: 'STORM' },
];

type CountersOverlayProps = {
  visible: boolean;
  onClose: () => void;
  playerId: number | null;
  playerName: string;
  counters: Record<string, number>;
  onUpdateCounters: (playerId: number, counterType: string, newValue: number) => void;
  playerModes: string[];
  onModeChange: (playerId: number, mode: string) => void;
};

export default function CountersOverlay({
  visible,
  onClose,
  playerId,
  playerName,
  counters,
  onUpdateCounters,
  playerModes,
  onModeChange,
}: CountersOverlayProps) {

  const adjustCounter = (counterType: string, amount: number) => {
    if (!playerId) return;
    const currentValue = counters[counterType] || 0;
    const newValue = Math.max(0, currentValue + amount);
    onUpdateCounters(playerId, counterType, newValue);
  };

  const handleModeToggle = (mode: string) => {
    if (!playerId) return;
    onModeChange(playerId, mode);
  };

  if (!visible || !playerId) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlayContainer}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.overlayContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Tryby jako toggle - teraz obsługuje wielokrotny wybór */}
            <View style={styles.overlayHeader}>
              {['MONARCH', 'INITIATIVE', 'ASCEND'].map((mode) => (
                <Pressable
                  key={mode}
                  style={[
                    styles.modeButton,
                    playerModes.includes(mode) && styles.activeModeButton,
                  ]}
                  onPress={() => handleModeToggle(mode)}
                >
                  <Text style={[
                    styles.modeButtonText,
                    playerModes.includes(mode) && styles.activeModeButtonText,
                  ]}>
                    {mode}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.countersTitle}>
              Counters - {playerName}
            </Text>

            {/* Reszta kodu pozostaje bez zmian */}
            <View style={styles.countersList}>
              {COUNTER_TYPES.map((counter) => (
                <View key={counter.key} style={styles.counterRow}>
                  <Text style={styles.counterLabel}>{counter.label}</Text>
                  <View style={styles.counterControls}>
                    <TouchableOpacity
                      style={styles.counterButton}
                      onPress={() => adjustCounter(counter.key, -1)}
                    >
                      <Text style={styles.counterButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>
                      {counters[counter.key] || 0}
                    </Text>
                    <TouchableOpacity
                      style={styles.counterButton}
                      onPress={() => adjustCounter(counter.key, 1)}
                    >
                      <Text style={styles.counterButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <Pressable
              style={styles.backButton}
              onPress={onClose}
            >
              <Text style={styles.backButtonText}>BACK</Text>
            </Pressable>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
    maxHeight: screenHeight * 0.85,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  overlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  modeButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#555',
    flex: 1,
    alignItems: 'center',
    minHeight: 36,
    justifyContent: 'center',
  },
  activeModeButton: {
    backgroundColor: '#4a5568',
    borderColor: '#718096',
  },
  modeButtonText: {
    color: '#ccc',
    fontSize: screenWidth < 350 ? 10 : 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeModeButtonText: {
    color: 'white',
  },
  countersTitle: {
    color: 'white',
    fontSize: screenWidth < 350 ? 20 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modeTitle: {
    color: '#4a5568',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  countersList: {
    marginBottom: 20,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    minHeight: 50,
  },
  counterLabel: {
    color: 'white',
    fontSize: screenWidth < 350 ? 14 : 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#555',
    minWidth: 120,
    height: 40,
  },
  counterButton: {
    paddingHorizontal: screenWidth < 350 ? 12 : 16,
    paddingVertical: 8,
    backgroundColor: '#444',
    borderRadius: 4,
    minWidth: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  counterValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  backButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    marginTop: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
