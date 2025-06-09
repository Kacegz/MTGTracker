import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const COUNTER_TYPES = [
  { key: 'generic', label: 'GENERIC' },
  { key: 'energy', label: 'ENERGY' },
  { key: 'poison', label: 'POISON' },
  { key: 'experience', label: 'EXPERIENCE' },
  { key: 'burden', label: 'BURDEN' },
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
    if (playerId === null) return;
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayContent: {
    backgroundColor: '#000000',
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
    maxHeight: screenHeight * 95,
    overflow: 'hidden',
    alignItems: 'center',
    alignSelf: 'center',
  },
  scrollContent: {
    padding: 30,
    paddingBottom: 30,
  },
  overlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 24,
  },
  modeButton: {
    backgroundColor: '#3B3B3B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#627AFF',
    flex: 1,
    alignItems: 'center',
    minHeight: 36,
    justifyContent: 'center',
  },
  activeModeButton: {
    backgroundColor: '#627AFF',
    borderColor: '#627AFF',
  },
  modeButtonText: {
    color: 'white',
    fontSize: screenWidth < 350 ? 12 : 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeModeButtonText: {
    color: 'white',
  },
  countersTitle: {
    color: 'white',
    fontSize: screenWidth < 350 ? 20 : 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
    minHeight: 50,
    gap: 12,
  },
  counterLabel: {
    color: 'white',
    fontSize: screenWidth < 350 ? 14 : 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    textAlign: 'center',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#627AFF',
    minWidth: 140,
    height: 48,
    alignContent: 'center',
  },
  counterButton: {
    paddingHorizontal: screenWidth < 350 ? 14 : 18,
    paddingVertical: 8,
    backgroundColor: '#000',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 6,
    minWidth: 40,
    height: 44,
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
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#627AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 44,
    maxWidth: screenWidth < 350 ? 120 : 210,
    alignSelf: 'center', 
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
