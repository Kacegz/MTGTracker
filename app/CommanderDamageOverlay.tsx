import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, StatusBar, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Player {
  id: number;
  color: string;
}

interface DamageScreenProps {
  visible: boolean;
  onClose: () => void;
  players: Player[];
  onDealDamage: (playerId: number, damage: number) => void;
  onDealCommanderDamage: (sourceId: number, targetId: number, damage: number) => void;
  commanderDamage: Record<number, Record<number, number>>;
  initiatingPlayerId: number | null;
  isLeftSide: boolean;
}

const DamageScreen = ({ 
    visible, 
    onClose, 
    players, 
    onDealDamage, 
    onDealCommanderDamage, 
    commanderDamage, 
    initiatingPlayerId, 
    isLeftSide 
  }: DamageScreenProps) => {
    const [damageValues, setDamageValues] = useState<Record<number, number>>({});
    const [partnerToggles, setPartnerToggles] = useState<Record<number, boolean>>({});
    const [localCommanderDamage, setLocalCommanderDamage] = useState<Record<number, Record<number, number>>>({});
  
    useEffect(() => {
      if (visible && initiatingPlayerId) {
        loadDamageValues();
        loadPartnerToggles();
        loadCommanderDamage();
      }
    }, [visible, initiatingPlayerId]);
  
    const loadDamageValues = () => {
      try {
        const savedDamageValues = localStorage.getItem(`damageValues_${initiatingPlayerId}`);
        if (savedDamageValues) {
          setDamageValues(JSON.parse(savedDamageValues));
        } else {
          const initialValues: Record<number, number> = {};
          players.forEach(player => {
            initialValues[player.id] = 0;
          });
          setDamageValues(initialValues);
        }
      } catch (error) {
        console.error('Error loading damage values:', error);
        const initialValues: Record<number, number> = {};
        players.forEach(player => {
          initialValues[player.id] = 0;
        });
        setDamageValues(initialValues);
      }
    };
  
    const loadCommanderDamage = () => {
      try {
        const savedCommanderDamage = localStorage.getItem('commanderDamage');
        if (savedCommanderDamage) {
          setLocalCommanderDamage(JSON.parse(savedCommanderDamage));
        }
      } catch (error) {
        console.error('Error loading commander damage:', error);
      }
    };
  
    const saveCommanderDamage = (newCommanderDamage: Record<number, Record<number, number>>) => {
      try {
        localStorage.setItem('commanderDamage', JSON.stringify(newCommanderDamage));
        setLocalCommanderDamage(newCommanderDamage);
      } catch (error) {
        console.error('Error saving commander damage:', error);
      }
    };
  
    const saveDamageValues = (newDamageValues: Record<number, number>) => {
      try {
        localStorage.setItem(`damageValues_${initiatingPlayerId}`, JSON.stringify(newDamageValues));
        setDamageValues(newDamageValues);
      } catch (error) {
        console.error('Error saving damage values:', error);
      }
    };
  
    const loadPartnerToggles = () => {
      try {
        const savedToggles = localStorage.getItem('partnerToggles');
        if (savedToggles) {
          setPartnerToggles(JSON.parse(savedToggles));
        }
      } catch (error) {
        console.error('Error loading partner toggles:', error);
      }
    };
  
    const savePartnerToggles = (newToggles: Record<number, boolean>) => {
      try {
        localStorage.setItem('partnerToggles', JSON.stringify(newToggles));
        setPartnerToggles(newToggles);
      } catch (error) {
        console.error('Error saving partner toggles:', error);
      }
    };
  
    const adjustDamage = (playerId: number, amount: number) => {
      if (!initiatingPlayerId) return;
      
      const currentCommanderDamage = { ...localCommanderDamage };
      if (!currentCommanderDamage[playerId]) {
        currentCommanderDamage[playerId] = {};
      }
      
      const currentDamage = currentCommanderDamage[playerId][initiatingPlayerId] || 0;
      // Only allow decreasing if current damage is greater than 0
      if (amount < 0 && currentDamage <= 0) return;
      
      const newDamage = Math.max(0, currentDamage + amount);
      
      currentCommanderDamage[playerId][initiatingPlayerId] = newDamage;
      saveCommanderDamage(currentCommanderDamage);
      onDealCommanderDamage(playerId, initiatingPlayerId, amount);
      
      // Also update the life total
      onDealDamage(initiatingPlayerId, amount);
    };
  
    const togglePartner = (playerId: number) => {
      const newToggles = {
        ...partnerToggles,
        [playerId]: !partnerToggles[playerId]
      };
      savePartnerToggles(newToggles);
    };
  
    const handleDealDamage = () => {
      const totalDamage = Object.values(damageValues).reduce((sum: number, damage: number) => sum + damage, 0);
      
      if (totalDamage > 0 && initiatingPlayerId !== null) {
        onDealDamage(initiatingPlayerId, totalDamage);
        const currentCommanderDamage = { ...localCommanderDamage };
        Object.entries(damageValues).forEach(([playerId, damage]) => {
            if (damage > 0) {
              const sourcePlayerId = parseInt(playerId);
              
              if (!currentCommanderDamage[sourcePlayerId]) {
                currentCommanderDamage[sourcePlayerId] = {};
              }
              
              const currentDamage = currentCommanderDamage[sourcePlayerId][initiatingPlayerId] || 0;
              currentCommanderDamage[sourcePlayerId][initiatingPlayerId] = currentDamage + damage;
              
              onDealCommanderDamage(sourcePlayerId, initiatingPlayerId, damage);
            }
          });
          
        saveCommanderDamage(currentCommanderDamage);
      }
      
      const resetValues: Record<number, number> = {};
      players.forEach(player => {
        resetValues[player.id] = 0;
      });
      saveDamageValues(resetValues);
      onClose();
    };
  
    const handleClose = () => {
      onClose();
    };
  
    const resetAllDamage = () => {
      const resetValues: Record<number, number> = {};
      players.forEach(player => {
        resetValues[player.id] = 0;
      });
      saveDamageValues(resetValues);
    };
  
    const resetCommanderDamage = (sourcePlayerId: number, targetPlayerId: number) => {
      const currentCommanderDamage = { ...localCommanderDamage };
      if (currentCommanderDamage[sourcePlayerId]) {
        delete currentCommanderDamage[sourcePlayerId][targetPlayerId];
        if (Object.keys(currentCommanderDamage[sourcePlayerId]).length === 0) {
          delete currentCommanderDamage[sourcePlayerId];
        }
      }
      saveCommanderDamage(currentCommanderDamage);
    };
  
    if (!visible || !initiatingPlayerId) return null;
  
    const rotation = isLeftSide ? '90deg' : '-90deg';
  
    const renderPlayerSection = (player: Player, playerIndex: number, isTop = false, isLeft = false) => {
        const damage = damageValues[player.id] || 0;
        const isPartner = partnerToggles[player.id] || false;
        
        const commanderDamageDealtToInitiating = localCommanderDamage[player.id]?.[initiatingPlayerId] || 0;
        const isInitiatingPlayer = player.id === initiatingPlayerId;
        
        return (
          <View style={[
            styles.playerSection,
            { backgroundColor: isPartner ? player.color : '#333' },
            isTop ? { borderTopWidth: 1, borderTopColor: '#444' } : { borderBottomWidth: 1, borderBottomColor: '#444' },
            isLeft ? { borderLeftWidth: 1, borderLeftColor: '#444' } : { borderRightWidth: 1, borderRightColor: '#444' },
            isInitiatingPlayer ? styles.initiatingPlayer : null
          ]}>
            <View style={[styles.playerContent, { transform: [{ rotate: rotation }] }]}>
              <Text style={styles.playerId}>
                {"Player "}
                {player.id}
                {isInitiatingPlayer && " (target)"}
              </Text>
              
              <View style={styles.damageSection}>
                <Pressable 
                  style={styles.controlButton}
                  onPress={() => adjustDamage(player.id, -1)}
                >
                  <Ionicons name="remove" size={Platform.select({
                    android: 32,
                    default: 64
                  })} color="white" />
                </Pressable>
                
                <Text style={styles.damageValue}>
                  {commanderDamageDealtToInitiating > 0 ? commanderDamageDealtToInitiating : damage}
                </Text>
                
                <Pressable 
                  style={styles.controlButton}
                  onPress={() => adjustDamage(player.id, 1)}
                >
                  <Ionicons name="add" size={Platform.select({
                    android: 32,
                    default: 64
                  })} color="white" />
                </Pressable>
              </View>
      
              <View style={styles.playerSection}>
                <Text style={styles.partnerLabel}>Partner</Text>
                <Switch
                  value={isPartner}
                  onValueChange={() => togglePartner(player.id)}
                  trackColor={{ false: 'rgba(255, 255, 255, 0.3)', true: 'rgba(255, 255, 255, 0.8)' }}
                  thumbColor={isPartner ? '#fff' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>
        );
      };
  
    return (
      <Modal
        visible={visible}
        transparent={false}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <StatusBar hidden />
        <View style={styles.container}>
          <View style={styles.topRow}>
            {renderPlayerSection(players[0], 0, true, true)}
            {renderPlayerSection(players[1], 1, true, false)}
          </View>
  
          <View style={styles.middleSection}>
            <Pressable style={styles.gameButton} onPress={handleDealDamage}>
              <Text style={styles.gameButtonText}>BACK</Text>
            </Pressable>
          </View>
  
          <View style={styles.bottomRow}>
            {renderPlayerSection(players[2], 2, false, true)}
            {renderPlayerSection(players[3], 3, false, false)}
          </View>
        </View>
      </Modal>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topRow: {
    flex: 1,
    flexDirection: 'row',
  },
  bottomRow: {
    flex: 1,
    flexDirection: 'row',
  },
  playerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    height: Platform.select({
      android: '50%',
      default: '50%',
    }),
    width: '100%',
    paddingHorizontal: Platform.select({
      android: 2,
      default: 8,
    }),
  },
  damageSection: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: Platform.select({
      android: '50%',
      default: '40%',
    }),
    width: '100%',
    paddingHorizontal: Platform.select({
      android: 12,
      default: 16,
    }),
    gap: Platform.select({
      android: 8,
      default: 16,
    }),
  },
  playerId: {
    fontSize: Platform.select({
      android: 18,
      default: 24,
    }),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    paddingTop: Platform.select({
      android: 0,
      default: 5,
    }),
  },
  controlButton: {
    padding: Platform.select({
      android: 8,
      default: 25,
    }),
    borderRadius: Platform.select({
      android: 16,
      default: 25,
    }),
    width: Platform.select({
      android: 48,
      default: 50,
    }),
    height: Platform.select({
      android: 48,
      default: 50,
    }),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.select({
      android: -8,
      default: -20,
    }),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  damageValue: {
    fontSize: Platform.select({
      android: 64,
      default: 100,
    }),
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 0,
    flex: 1,
    textAlignVertical: 'center',
  },
  partnerSection: {
    alignItems: 'center',
    gap: Platform.select({
      android: 2,
      default: 10,
    }),
    paddingBottom: Platform.select({
      android: 4,
      default: 20,
    }),
  },
  partnerLabel: {
    fontSize: Platform.select({
      android: 14,
      default: 18,
    }),
    color: 'white',
    fontWeight: '600',
    paddingBottom: 0,
  },
  middleSection: {
    flexDirection: 'row',
    backgroundColor: '#222',
    paddingVertical: Platform.select({
      android: 4,
      default: 10,
    }),
    paddingHorizontal: Platform.select({
      android: 8,
      default: 20,
    }),
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameButton: {
    paddingHorizontal: Platform.select({
      android: 8,
      default: 20,
    }),
    paddingVertical: Platform.select({
      android: 4,
      default: 10,
    }),
  },
  gameButtonText: {
    color: 'white',
    fontSize: Platform.select({
      android: 16,
      default: 24,
    }),
    fontWeight: 'bold',
  },
  initiatingPlayer: {
    borderWidth: Platform.select({
      android: 1,
      default: 3,
    }),
    borderColor: '#FFD700',
  },
  resetButton: {
    paddingHorizontal: Platform.select({
      android: 8,
      default: 15,
    }),
    paddingVertical: Platform.select({
      android: 2,
      default: 6,
    }),
    backgroundColor: '#ff4444',
    borderRadius: 5,
  },
  resetButtonText: {
    color: 'white',
    fontSize: Platform.select({
      android: 10,
      default: 15,
    }),
    fontWeight: 'bold',
  },
  commanderDamageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: Platform.select({
      android: 2,
      default: 8,
    }),
    paddingVertical: Platform.select({
      android: 0,
      default: 2,
    }),
    borderRadius: 10,
  },
  commanderDamageText: {
    fontSize: Platform.select({
      android: 10,
      default: 14,
    }),
    color: 'white',
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default DamageScreen;