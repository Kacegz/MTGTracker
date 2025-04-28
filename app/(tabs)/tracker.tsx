import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // lub inny pakiet ikon

const players = [
  { id: 1, name: 'Player 1', color: '#1E3A8A' }, // niebieski
  { id: 2, name: 'Player 2', color: '#CA8A04' }, // żółty
  { id: 3, name: 'Player 3', color: '#15803D' }, // zielony
  { id: 4, name: 'Player 4', color: '#B91C1C' }, // czerwony
];

export default function LifeCounterScreen() {
  const [health, setHealth] = useState({
    1: 40,
    2: 40,
    3: 40,
    4: 40,
  });

  const adjustHealth = (playerId: number, amount: number) => {
    setHealth((prev) => ({
      ...prev,
      [playerId]: prev[playerId] + amount,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {players.slice(0, 2).map((player) => (
          <PlayerPanel
            key={player.id}
            player={player}
            health={health[player.id]}
            onAdjustHealth={adjustHealth}
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
            health={health[player.id]}
            onAdjustHealth={adjustHealth}
          />
        ))}
      </View>
    </View>
  );
}

type PlayerPanelProps = {
  player: { id: number; name: string; color: string };
  health: number;
  onAdjustHealth: (playerId: number, amount: number) => void;
};

function PlayerPanel({ player, health, onAdjustHealth }: PlayerPanelProps) {
  return (
    <View style={[styles.playerPanel, { backgroundColor: player.color }]}>
      <View style={styles.sideMenu}>
        <Pressable style={styles.iconButton}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <Ionicons name="flash-outline" size={24} color="white" />
          <Text style={styles.sideText}>Damage</Text>
        </Pressable>
        <Pressable style={styles.iconButton}>
          <Ionicons name="apps-outline" size={24} color="white" />
          <Text style={styles.sideText}>Counters</Text>
        </Pressable>
      </View>

      <View style={styles.healthContainer}>
        <Pressable onPress={() => onAdjustHealth(player.id, -1)}>
          <Text style={styles.adjustButton}>-</Text>
        </Pressable>

        <View style={styles.health}>
          <Text style={styles.healthText}>{health}</Text>
          <Text style={styles.playerName}>{player.name}</Text>
        </View>

        <Pressable onPress={() => onAdjustHealth(player.id, 1)}>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  iconButton: {
    marginVertical: 8,
    alignItems: 'center',
  },
  sideText: {
    color: 'white',
    fontSize: 10,
    marginTop: 2,
  },
  healthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustButton: {
    fontSize: 32,
    color: 'white',
    marginVertical: 8,
  },
  health: {
    alignItems: 'center',
  },
  healthText: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },
  playerName: {
    fontSize: 14,
    color: 'white',
  },
});
