import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountersOverlay from '../CountersOverlay';
import DamageScreen from '../CommanderDamageOverlay';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants'; // ADD: Import Constants for status bar height

type DamageMap = Record<number, Record<number, number>>;
type PlayerCountersMap = Record<number, Record<string, number>>;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const darkenHex = (hex: string, percent = 20) => {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0xff) - amt);
  const B = Math.max(0, (num & 0xff) - amt);
  return `#${(R << 16 | G << 8 | B).toString(16).padStart(6, '0')}`;
};

const players = [
  { id: 1, name: 'Player 1', color: '#1E3A8A' },
  { id: 2, name: 'Player 2', color: '#CA8A04' },
  { id: 3, name: 'Player 3', color: '#15803D' },
  { id: 4, name: 'Player 4', color: '#B91C1C' },
]

const COUNTER_TYPES = [
  'generic', 'energy', 'poison', 'experience', 'elderRing', 'storm'
];

// Storage keys
const STORAGE_KEYS = {
  PLAYER_HEALTH: 'playerHealth',
  PLAYER_COUNTERS: 'playerCounters',
  PLAYER_MODES: 'playerModes',
  COMMANDER_DAMAGE: 'commanderDamage',
};

// Default values
const getInitialHealth = () => ({
  1: 40,
  2: 40,
  3: 40,
  4: 40,
});

const getInitialCounters = (): PlayerCountersMap => {
  const initialCounters: PlayerCountersMap = {};
  players.forEach(player => {
    initialCounters[player.id] = {};
    COUNTER_TYPES.forEach(counter => {
      initialCounters[player.id][counter] = 0;
    });
  });
  return initialCounters;
};

const getInitialPlayerModes = () => {
  const initialModes: Record<number, string[]> = {};
  players.forEach(player => {
    initialModes[player.id] = [];
  });
  return initialModes;
};

const getInitialCommanderDamage = (): DamageMap => {
  const initialDamage: DamageMap = {};
  players.forEach(player => {
    initialDamage[player.id] = {};
    players.forEach(target => {
      if (target.id !== player.id) {
        initialDamage[player.id][target.id] = 0;
      }
    });
  });
  return initialDamage;
};

export default function LifeCounterScreen() {
  const [health, setHealth] = useState<Record<number, number>>(getInitialHealth());
  const [counters, setCounters] = useState<Record<number, Record<string, number>>>(getInitialCounters());
  const [playerModes, setPlayerModes] = useState<Record<number, string[]>>(getInitialPlayerModes());
  const [commanderDamage, setCommanderDamage] = useState<Record<number, Record<number, number>>>(getInitialCommanderDamage());
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [damageScreenVisible, setDamageScreenVisible] = useState(false);
  const [initiatingPlayerId, setInitiatingPlayerId] = useState<number | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      loadHealth(),
      loadCounters(),
      loadPlayerModes(),
      loadCommanderDamage(),
    ]);
  };

  const loadHealth = async () => {
    try {
      const savedHealth = await AsyncStorage.getItem(STORAGE_KEYS.PLAYER_HEALTH);
      if (savedHealth) {
        setHealth(JSON.parse(savedHealth));
      } else {
        const initialHealth = getInitialHealth();
        setHealth(initialHealth);
        await AsyncStorage.setItem(STORAGE_KEYS.PLAYER_HEALTH, JSON.stringify(initialHealth));
      }
    } catch (error) {
      console.error('Error loading health:', error);
      setHealth(getInitialHealth());
    }
  };

  const saveHealth = async (newHealth: Record<number, number>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYER_HEALTH, JSON.stringify(newHealth));
      setHealth(newHealth);
    } catch (error) {
      console.error('Error saving health:', error);
    }
  };

  const loadCommanderDamage = async () => {
    try {
      const savedDamage = await AsyncStorage.getItem(STORAGE_KEYS.COMMANDER_DAMAGE);
      if (savedDamage) {
        setCommanderDamage(JSON.parse(savedDamage));
      } else {
        const initialDamage = getInitialCommanderDamage();
        setCommanderDamage(initialDamage);
        await AsyncStorage.setItem(STORAGE_KEYS.COMMANDER_DAMAGE, JSON.stringify(initialDamage));
      }
    } catch (error) {
      console.error('Error loading commander damage:', error);
      setCommanderDamage(getInitialCommanderDamage());
    }
  };

  const saveCommanderDamage = async (newDamage: Record<number, Record<number, number>>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COMMANDER_DAMAGE, JSON.stringify(newDamage));
      setCommanderDamage(newDamage);
    } catch (error) {
      console.error('Error saving commander damage:', error);
    }
  };

  const loadCounters = async () => {
    try {
      const savedCounters = await AsyncStorage.getItem(STORAGE_KEYS.PLAYER_COUNTERS);
      if (savedCounters) {
        setCounters(JSON.parse(savedCounters));
      } else {
        const initialCounters = getInitialCounters();
        setCounters(initialCounters);
        await AsyncStorage.setItem(STORAGE_KEYS.PLAYER_COUNTERS, JSON.stringify(initialCounters));
      }
    } catch (error) {
      console.error('Error loading counters:', error);
      setCounters(getInitialCounters());
    }
  };

  const loadPlayerModes = async () => {
    try {
      const savedModes = await AsyncStorage.getItem(STORAGE_KEYS.PLAYER_MODES);
      if (savedModes) {
        setPlayerModes(JSON.parse(savedModes));
      } else {
        const initialModes = getInitialPlayerModes();
        setPlayerModes(initialModes);
        await AsyncStorage.setItem(STORAGE_KEYS.PLAYER_MODES, JSON.stringify(initialModes));
      }
    } catch (error) {
      console.error('Error loading player modes:', error);
      setPlayerModes(getInitialPlayerModes());
    }
  };

  const saveCounters = async (newCounters: Record<number, Record<string, number>>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYER_COUNTERS, JSON.stringify(newCounters));
      setCounters(newCounters);
    } catch (error) {
      console.error('Error saving counters:', error);
    }
  };

  const savePlayerModes = async (newModes: Record<number, string[]>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYER_MODES, JSON.stringify(newModes));
      setPlayerModes(newModes);
    } catch (error) {
      console.error('Error saving player modes:', error);
    }
  };

  const adjustHealth = (playerId: number, amount: number) => {
    const newHealth = {
      ...health,
      [playerId]: health[playerId] + amount,
    };
    saveHealth(newHealth);
  };

  const openCountersOverlay = (playerId: number) => {
    setSelectedPlayer(playerId);
    setOverlayVisible(true);
  };

  const openDamageScreen = (playerId: number) => {
    setInitiatingPlayerId(playerId);
    setDamageScreenVisible(true);
  };

  const dealDamage = (playerId: number, amount: number) => {
    adjustHealth(playerId, -amount);
  };

  const dealCommanderDamage = (fromPlayerId: number, toPlayerId: number, amount: number) => {
    const newCommanderDamage = {
      ...commanderDamage,
      [fromPlayerId]: {
        ...commanderDamage[fromPlayerId],
        [toPlayerId]: (commanderDamage[fromPlayerId]?.[toPlayerId] || 0) + amount
      }
    };
    saveCommanderDamage(newCommanderDamage);
  };

  const getOrientation = (playerId: number | null) => {
    if (playerId === null) return false;
    return playerId == 1 || playerId == 3;
  };

  const updatePlayerCounters = (playerId: number, counterType: string, newValue: number) => {
    const newCounters = {
      ...counters,
      [playerId]: {
        ...counters[playerId],
        [counterType]: newValue,
      },
    };
    saveCounters(newCounters);
  };

  const updatePlayerMode = (playerId: number, mode: string) => {
    const currentModes = playerModes[playerId] || [];
    let newModes;
    
    if (currentModes.includes(mode)) {
      newModes = currentModes.filter((m: string) => m !== mode);
    } else {
      newModes = [...currentModes, mode];
    }
    
    const updatedPlayerModes = {
      ...playerModes,
      [playerId]: newModes,
    };
    savePlayerModes(updatedPlayerModes);
  };

  const getSelectedPlayerName = () => {
    const player = players.find(p => p.id === selectedPlayer);
    return player ? player.name : '';
  };

  const getSelectedPlayerCounters = () => {
    return selectedPlayer ? (counters[selectedPlayer] || {}) : {};
  };

  const getSelectedPlayerMode = () => {
    return selectedPlayer ? (playerModes[selectedPlayer] || []) : [];
  };

  const handleReset = async () => {
    try {
      // Clear all stored data
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.PLAYER_HEALTH,
        STORAGE_KEYS.PLAYER_COUNTERS,
        STORAGE_KEYS.PLAYER_MODES,
        STORAGE_KEYS.COMMANDER_DAMAGE,
      ]);

      // Reset all state to initial values
      const initialHealth = getInitialHealth();
      const initialCounters = getInitialCounters();
      const initialModes = getInitialPlayerModes();
      const initialDamage = getInitialCommanderDamage();

      setHealth(initialHealth);
      setCounters(initialCounters);
      setPlayerModes(initialModes);
      setCommanderDamage(initialDamage);

      // Save initial values to storage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.PLAYER_HEALTH, JSON.stringify(initialHealth)),
        AsyncStorage.setItem(STORAGE_KEYS.PLAYER_COUNTERS, JSON.stringify(initialCounters)),
        AsyncStorage.setItem(STORAGE_KEYS.PLAYER_MODES, JSON.stringify(initialModes)),
        AsyncStorage.setItem(STORAGE_KEYS.COMMANDER_DAMAGE, JSON.stringify(initialDamage)),
      ]);

      setOptionsVisible(false);
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* ADD: Status bar spacer */}
      <StatusBar style="light" backgroundColor="#111" />
      <View style={styles.statusBarSpacer} />
      <View style={styles.row}>
        {players.slice(0, 2).map((player) => (
          <PlayerPanel
            key={player.id}
            player={player}
            health={health[player.id] || 40}
            onAdjustHealth={adjustHealth}
            onOpenCounters={() => openCountersOverlay(player.id)}
            onOpenDamage={() => openDamageScreen(player.id)}
            playerMode={playerModes[player.id] || []} 
          />
        ))}
      </View>
  
      <View style={styles.menu}>
        <Text style={styles.menuText}>GAME</Text>
        <Pressable onPress={() => setOptionsVisible(true)}>
          <Ionicons name="settings-outline" size={28} color="white" />
        </Pressable>
        <Text style={styles.menuText}>OPTIONS</Text>
      </View>
  
      <View style={styles.row}>
        {players.slice(2, 4).map((player) => (
          <PlayerPanel
            key={player.id}
            player={player}
            health={health[player.id] || 40}
            onAdjustHealth={adjustHealth}
            onOpenCounters={() => openCountersOverlay(player.id)}
            onOpenDamage={() => openDamageScreen(player.id)}
            playerMode={playerModes[player.id] || []} 
          />
        ))}
      </View>
  
      <CountersOverlay
        visible={overlayVisible}
        onClose={() => setOverlayVisible(false)}
        playerId={selectedPlayer}
        playerName={getSelectedPlayerName()}
        counters={getSelectedPlayerCounters()}
        onUpdateCounters={updatePlayerCounters}
        playerModes={getSelectedPlayerMode()}
        onModeChange={updatePlayerMode}
      />
  
      <DamageScreen
        visible={damageScreenVisible}
        onClose={() => setDamageScreenVisible(false)}
        players={players}
        onDealDamage={dealDamage}
        onDealCommanderDamage={dealCommanderDamage} 
        commanderDamage={commanderDamage} 
        initiatingPlayerId={initiatingPlayerId} 
        isLeftSide={getOrientation(initiatingPlayerId)}
      />

      <Modal
        visible={optionsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOptionsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable 
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>RESET</Text>
            </Pressable>
            <Pressable 
              style={styles.closeButton}
              onPress={() => setOptionsVisible(false)}
            >
              <Text style={styles.closeButtonText}>CLOSE</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

type PlayerPanelProps = {
  player: { id: number; name: string; color: string };
  health: number;
  onAdjustHealth: (playerId: number, amount: number) => void;
  onOpenCounters: () => void;
  onOpenDamage: () => void;
  playerMode: string[];
};

function PlayerPanel({ player, health, onAdjustHealth, onOpenCounters, onOpenDamage, playerMode }: PlayerPanelProps) {
  const isLeftSide = player.id === 1 || player.id === 3;
  const iconTextRotation = isLeftSide ? '90deg' : '-90deg';
  const flexDirection = isLeftSide ? 'column' : 'column-reverse';
  const top = isLeftSide ? '-10%' : '5%';
  const left = isLeftSide ? '2%' : '-2%';
  
  return (
    <LinearGradient
      colors={isLeftSide 
        ? [darkenHex(player.color, 30), player.color] 
        : [player.color, darkenHex(player.color, 30)]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.playerPanel}
    >  
      <View style={styles.playerContent}>
        {isLeftSide ? (
          <>
            {/* Action Buttons */}
            <View style={[styles.actionButtonsContainer, { flexDirection: 'column' }]}>
              <Pressable style={styles.actionButton} onPress={onOpenDamage}>
                <View style={[styles.actionButtonContent, {flexDirection: flexDirection}]}>
                  <Ionicons 
                    name="flash-outline" 
                    size={24} 
                    color="white" 
                    style={[{ transform: [{ rotate: iconTextRotation }] }, { top }]}
                  />
                  <Text style={[styles.actionButtonText, { transform: [{ rotate: iconTextRotation }] }, { top }]}>
                    Damage
                  </Text>
                </View>
              </Pressable>
              
              <Pressable style={styles.actionButton} onPress={onOpenCounters}>
                <View style={[styles.actionButtonContent, {flexDirection: flexDirection}]}>
                  <Ionicons 
                    name="apps-outline" 
                    size={24} 
                    color="white" 
                    style={[{ transform: [{ rotate: iconTextRotation }] }, { top }]}
                  />
                  <Text style={[styles.actionButtonText, { transform: [{ rotate: iconTextRotation }] }, { top }]}>
                    Counters
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Life Total */}
            <View style={[styles.lifeContainer, { left }]}>
              <Pressable 
                style={styles.lifeButton}
                onPress={() => onAdjustHealth(player.id, 1)}
              >
                <Text style={[styles.lifeButtonText, { transform: [{ rotate: '90deg' }] }]}>+</Text>
              </Pressable>

              <View style={styles.lifeTotal}>
                <Text style={[styles.lifeText, { transform: [{ rotate: iconTextRotation }] }]}>
                  {health}
                </Text>
              </View>

              <Pressable 
                style={styles.lifeButton}
                onPress={() => onAdjustHealth(player.id, -1)}
              >
                <Text style={[styles.lifeButtonText, { transform: [{ rotate: '90deg' }] }]}>-</Text>
              </Pressable>
            </View>

            {/* Player Name */}
            <View style={[styles.playerNameContainer, { transform: [{ rotate: iconTextRotation }] }, { left }]}>
              <Text style={[styles.playerName]}>
                {player.name}
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* Player Name */}
            <View style={[styles.playerNameContainer, { transform: [{ rotate: iconTextRotation }] }, { left }]}>
              <Text style={[styles.playerName]}>
                {player.name}
              </Text>
            </View>

            {/* Life Total */}
            <View style={[styles.lifeContainer, { left }]}>
              <Pressable 
                style={styles.lifeButton}
                onPress={() => onAdjustHealth(player.id, 1)}
              >
                <Text style={[styles.lifeButtonText, { transform: [{ rotate: '-90deg' }] }]}>+</Text>
              </Pressable>

              <View style={styles.lifeTotal}>
                <Text style={[styles.lifeText, { transform: [{ rotate: iconTextRotation }] }]}>
                  {health}
                </Text>
              </View>

              <Pressable 
                style={styles.lifeButton}
                onPress={() => onAdjustHealth(player.id, -1)}
              >
                <Text style={[styles.lifeButtonText, { transform: [{ rotate: '-90deg' }] }]}>-</Text>
              </Pressable>
            </View>

            {/* Action Buttons */}
            <View style={[styles.actionButtonsContainer, { flexDirection: 'column-reverse' }]}>
              <Pressable style={styles.actionButton} onPress={onOpenDamage}>
                <View style={styles.actionButtonContent}>
                  <Ionicons 
                    name="flash-outline" 
                    size={24} 
                    color="white" 
                    style={{ transform: [{ rotate: iconTextRotation }] }}
                  />
                  <Text style={[styles.actionButtonText, { transform: [{ rotate: iconTextRotation }] }]}>
                    Damage
                  </Text>
                </View>
              </Pressable>
              
              <Pressable style={styles.actionButton} onPress={onOpenCounters}>
                <View style={styles.actionButtonContent}>
                  <Ionicons 
                    name="apps-outline" 
                    size={24} 
                    color="white" 
                    style={{ transform: [{ rotate: iconTextRotation }] }}
                  />
                  <Text style={[styles.actionButtonText, { transform: [{ rotate: iconTextRotation }] }]}>
                    Counters
                  </Text>
                </View>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  // ADD: Status bar spacer style
  statusBarSpacer: {
    height: Constants.statusBarHeight,
    backgroundColor: '#111',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    columnGap: 4,
  },
  menu: {
    height: '5%',
    backgroundColor: '#222',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingLeft: 50,
    paddingRight: 20,
  },
  menuText: {
    color: 'white',
    fontSize: 20,
  },
  playerPanel: {
    flex: 1,
    padding: Platform.select({
      android: 4,
      default: 10,
    }),
  },
  playerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Platform.select({
      android: 0,
      default: 8,
    }),
  },
  playerNameContainer: {
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -4,
    paddingHorizontal: Platform.select({
      android: 0,
      default: 10,
    }),
  },
  playerName: {
    fontSize: Platform.select({
      android: 14,
      default: 18,
    }),
    color: 'white',
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '100%',
    minWidth: Platform.select({
      android: 50,
      default: 80,
    }),
    maxWidth: Platform.select({
      android: 50,
      default: 100,
    }),
  },
  actionButton: {
    height: '40%',
    justifyContent: 'center',
    width: '100%',
    minWidth: Platform.select({
      android: 60,
      default: 80,
    }),
    maxWidth: Platform.select({
      android: 70,
      default: 100,
    }),
  },
  actionButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexDirection: 'column-reverse',
    gap: Platform.select({
      android: '20%',
      default: '20%',
    }),
    top: Platform.select({
      android: '5%',
      default: '5%',
    }),
  },
  actionButtonText: {
    color: 'white',
    fontSize: Platform.select({
      android: 12,
      default: 14,
    }),
    marginTop: 2,
    textAlign: 'center',
    width: '100%',
  },
  lifeContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Platform.select({
      android: 20,
      default: 4,
    }),
    minWidth: Platform.select({
      android: 70,
      default: 60,
    }),
    maxWidth: Platform.select({
      android: 70,
      default: 80,
    }),
  },
  lifeButton: {
    width: Platform.select({
      android: 32,
      default: 40,
    }),
    height: Platform.select({
      android: 32,
      default: 40,
    }),
    justifyContent: 'center',
    alignItems: 'center',
  },
  lifeButtonText: {
    fontSize: Platform.select({
      android: 28,
      default: 36,
    }),
    color: 'white',
    fontWeight: 'bold',
  },
  lifeTotal: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Platform.select({
      android: 48,
      default: 60,
    }),
  },
  lifeText: {
    fontSize: Platform.select({
      android: 48,
      default: 48,
    }),
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    gap: 20,
  },
  resetButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});