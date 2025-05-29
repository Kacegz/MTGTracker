import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CountersOverlay from './CountersOverlay';
import DamageScreen from './CommanderDamageOverlay';

const players = [
  { id: 1, name: 'Player 1', color: '#1E3A8A' },
  { id: 2, name: 'Player 2', color: '#CA8A04' },
  { id: 3, name: 'Player 3', color: '#15803D' },
  { id: 4, name: 'Player 4', color: '#B91C1C' },
];

const COUNTER_TYPES = [
  'generic', 'energy', 'poison', 'experience', 'elderRing', 'storm'
];

export default function LifeCounterScreen() {
  const [health, setHealth] = useState({});
  const [counters, setCounters] = useState({});
  const [playerModes, setPlayerModes] = useState({});
  const [commanderDamage, setCommanderDamage] = useState({});
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [damageScreenVisible, setDamageScreenVisible] = useState(false);
  const [initiatingPlayerId, setInitiatingPlayerId] = useState(null);

  useEffect(() => {
    loadHealth(); 
    loadCounters();
    loadPlayerModes();
    loadCommanderDamage(); 
  }, []);


  const loadHealth = () => {
    try {
      const savedHealth = localStorage.getItem('playerHealth');
      if (savedHealth) {
        setHealth(JSON.parse(savedHealth));
      } else {
        const initialHealth = {
          1: 40,
          2: 40,
          3: 40,
          4: 40,
        };
        setHealth(initialHealth);
        localStorage.setItem('playerHealth', JSON.stringify(initialHealth));
      }
    } catch (error) {
      console.error('Error loading health:', error);
    }
  };

  const saveHealth = (newHealth) => {
    try {
      localStorage.setItem('playerHealth', JSON.stringify(newHealth));
      setHealth(newHealth);
    } catch (error) {
      console.error('Error saving health:', error);
    }
  };

  const loadCommanderDamage = () => {
    try {
      const savedDamage = localStorage.getItem('commanderDamage');
      if (savedDamage) {
        setCommanderDamage(JSON.parse(savedDamage));
      } else {
        const initialDamage = {};
        players.forEach(player => {
          initialDamage[player.id] = {};
          players.forEach(target => {
            if (target.id !== player.id) {
              initialDamage[player.id][target.id] = 0;
            }
          });
        });
        setCommanderDamage(initialDamage);
        localStorage.setItem('commanderDamage', JSON.stringify(initialDamage));
      }
    } catch (error) {
      console.error('Error loading commander damage:', error);
    }
  };

  const saveCommanderDamage = (newDamage) => {
    try {
      localStorage.setItem('commanderDamage', JSON.stringify(newDamage));
      setCommanderDamage(newDamage);
    } catch (error) {
      console.error('Error saving commander damage:', error);
    }
  };

  const loadCounters = () => {
    try {
      const savedCounters = localStorage.getItem('playerCounters');
      if (savedCounters) {
        setCounters(JSON.parse(savedCounters));
      } else {
        const initialCounters = {};
        players.forEach(player => {
          initialCounters[player.id] = {};
          COUNTER_TYPES.forEach(counter => {
            initialCounters[player.id][counter] = 0;
          });
        });
        setCounters(initialCounters);
        localStorage.setItem('playerCounters', JSON.stringify(initialCounters));
      }
    } catch (error) {
      console.error('Error loading counters:', error);
    }
  };

  const loadPlayerModes = () => {
    try {
      const savedModes = localStorage.getItem('playerModes');
      if (savedModes) {
        setPlayerModes(JSON.parse(savedModes));
      } else {
        const initialModes = {};
        players.forEach(player => {
          initialModes[player.id] = [];
        });
        setPlayerModes(initialModes);
        localStorage.setItem('playerModes', JSON.stringify(initialModes));
      }
    } catch (error) {
      console.error('Error loading player modes:', error);
    }
  };

  const saveCounters = (newCounters) => {
    try {
      localStorage.setItem('playerCounters', JSON.stringify(newCounters));
      setCounters(newCounters);
    } catch (error) {
      console.error('Error saving counters:', error);
    }
  };

  const savePlayerModes = (newModes) => {
    try {
      localStorage.setItem('playerModes', JSON.stringify(newModes));
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
      newModes = currentModes.filter(m => m !== mode);
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

  return (
    <View style={styles.container}>
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
        <Pressable>
          <Text style={styles.menuText}>GAME</Text>
        </Pressable>
        <Ionicons name="settings-outline" size={24} color="white" />
        <Pressable>
          <Text style={styles.menuText}>OPTIONS</Text>
        </Pressable>
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
    </View>
  );
  
}

type PlayerPanelProps = {
  player: { id: number; name: string; color: string };
  health: number;
  onAdjustHealth: (playerId: number, amount: number) => void;
  onOpenCounters: () => void;
  onOpenDamage: () => void;
  playerMode: string;
};

function PlayerPanel({ player, health, onAdjustHealth, onOpenCounters, onOpenDamage, playerMode }: PlayerPanelProps) {
  const isLeftSide = player.id === 1 || player.id === 3;
  const iconTextRotation = isLeftSide ? '90deg' : '-90deg';
  
  return (
    <View style={[styles.playerPanel, { backgroundColor: player.color },{flexDirection: isLeftSide ? 'row' : 'row-reverse'}]}>
      <View style={styles.sideMenu}>
        <Pressable style={styles.iconButton}>
          <View style={styles.iconWrapper}>
            <Ionicons 
              name="settings-outline" 
              size={20} 
              color="white" 
              style={{ transform: [{ rotate: iconTextRotation }] }}
            />
          </View>
        </Pressable>
        
        <Pressable style={styles.iconButton} onPress={onOpenDamage}>
          <View style={[
            styles.iconWithTextWrapper,
            { flexDirection: isLeftSide ? 'column' : 'column-reverse' }
          ]}>
            <View style={styles.iconWrapper}>
              <Ionicons 
                name="flash-outline" 
                size={20} 
                color="white" 
                style={{ transform: [{ rotate: iconTextRotation }] }}
              />
            </View>
            <View style={styles.rotatedTextWrapper}>
              <Text style={[
                styles.sideText, 
                { transform: [{ rotate: iconTextRotation }] }
              ]}>
                Damage
              </Text>
            </View>
          </View>
        </Pressable>
        
        <Pressable style={styles.iconButton} onPress={onOpenCounters}>
          <View style={[
            styles.iconWithTextWrapper,
            { flexDirection: isLeftSide ? 'column' : 'column-reverse' }
          ]}>
            <View style={styles.iconWrapper}>
              <Ionicons 
                name="apps-outline" 
                size={20} 
                color="white" 
                style={{ transform: [{ rotate: iconTextRotation }] }}
              />
            </View>
            <View style={styles.rotatedTextWrapper}>
              <Text style={[
                styles.sideText, 
                { transform: [{ rotate: iconTextRotation }] }
              ]}>
                Counters
              </Text>
            </View>
          </View>
        </Pressable>
      </View>

      <View style={[styles.healthContainer,{flexDirection: isLeftSide ? 'column' : 'column-reverse'}]}>
        <Pressable 
          style={styles.adjustButtonContainer}
          onPress={() => onAdjustHealth(player.id, -1)}
        >
          <Text style={styles.adjustButton}>-</Text>
        </Pressable>

        <View style={styles.health}>
          <View style={styles.healthNumberWrapper}>
            <Text style={[
              styles.healthText,
              { transform: [{ rotate: iconTextRotation }] }
            ]}>
              {health}
            </Text>
          </View>
        </View>

        <Pressable 
          style={styles.adjustButtonContainer}
          onPress={() => onAdjustHealth(player.id, 1)}
        >
          <Text style={styles.adjustButton}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  menu: {
    height: 60,
    backgroundColor: '#222',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  menuText: {
    color: 'white',
    fontSize: 16,
  },
  playerPanel: {
    flex: 1,
    flexDirection: 'row',
  },
  sideMenu: {
    width: 70,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 60,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWithTextWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    gap: 20,
  },
  rotatedTextWrapper: {
    width: 60,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideText: {
    color: 'white',
    fontSize: 9,
    textAlign: 'center',
    position: 'absolute',
    width: 50,
  },
  healthContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
  },
  adjustButtonContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustButton: {
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  health: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 15,
  },
  healthNumberWrapper: {
    width: 80,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthText: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
  },
  playerNameWrapper: {
    width: 80,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    position: 'absolute',
    width: 70,
  },
  playerModeWrapper: {
    width: 80,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerMode: {
    fontSize: 10,
    color: '#ccc',
    textAlign: 'center',
    position: 'absolute',
    width: 70,
  },
});
