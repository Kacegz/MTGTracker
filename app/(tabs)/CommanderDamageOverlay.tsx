import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, StatusBar, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DamageScreen = ({ 
    visible, 
    onClose, 
    players, 
    onDealDamage, 
    onDealCommanderDamage, 
    commanderDamage, 
    initiatingPlayerId, 
    isLeftSide 
  }) => {
    const [damageValues, setDamageValues] = useState({});
    const [partnerToggles, setPartnerToggles] = useState({});
    const [localCommanderDamage, setLocalCommanderDamage] = useState({});
  
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
          const initialValues = {};
          players.forEach(player => {
            initialValues[player.id] = 0;
          });
          setDamageValues(initialValues);
        }
      } catch (error) {
        console.error('Error loading damage values:', error);
        const initialValues = {};
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
  
    const saveCommanderDamage = (newCommanderDamage) => {
      try {
        localStorage.setItem('commanderDamage', JSON.stringify(newCommanderDamage));
        setLocalCommanderDamage(newCommanderDamage);
      } catch (error) {
        console.error('Error saving commander damage:', error);
      }
    };
  
    const saveDamageValues = (newDamageValues) => {
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
  
    const savePartnerToggles = (newToggles) => {
      try {
        localStorage.setItem('partnerToggles', JSON.stringify(newToggles));
        setPartnerToggles(newToggles);
      } catch (error) {
        console.error('Error saving partner toggles:', error);
      }
    };
  
    const adjustDamage = (playerId, amount) => {
      const newDamageValues = {
        ...damageValues,
        [playerId]: Math.max(0, (damageValues[playerId] || 0) + amount)
      };
      saveDamageValues(newDamageValues);
    };
  
    const togglePartner = (playerId) => {
      const newToggles = {
        ...partnerToggles,
        [playerId]: !partnerToggles[playerId]
      };
      savePartnerToggles(newToggles);
    };
  
    const handleDealDamage = () => {
      const totalDamage = Object.values(damageValues).reduce((sum, damage) => sum + damage, 0);
      
      if (totalDamage > 0 && initiatingPlayerId) {
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
      

      const resetValues = {};
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
      const resetValues = {};
      players.forEach(player => {
        resetValues[player.id] = 0;
      });
      saveDamageValues(resetValues);
    };
  
    const resetCommanderDamage = (sourcePlayerId, targetPlayerId) => {
      const currentCommanderDamage = { ...localCommanderDamage };
      if (currentCommanderDamage[sourcePlayerId]) {
        delete currentCommanderDamage[sourcePlayerId][targetPlayerId];
        if (Object.keys(currentCommanderDamage[sourcePlayerId]).length === 0) {
          delete currentCommanderDamage[sourcePlayerId];
        }
      }
      saveCommanderDamage(currentCommanderDamage);
    };
  
    if (!visible) return null;
  
    const rotation = isLeftSide ? '90deg' : '-90deg';
  
    const renderPlayerSection = (player, playerIndex, isTop = false, isLeft = false) => {
        const damage = damageValues[player.id] || 0;
        const isPartner = partnerToggles[player.id] || false;
        
        const commanderDamageDealtToInitiating = localCommanderDamage[player.id]?.[initiatingPlayerId] || 0;
        const isInitiatingPlayer = player.id === initiatingPlayerId;
        
        return (
          <View style={[
            styles.playerSection,
            { backgroundColor: player.color },
            isTop ? styles.topSection : styles.bottomSection,
            isLeft ? styles.leftSection : styles.rightSection,
            isInitiatingPlayer ? styles.initiatingPlayer : null
          ]}>
            <View style={[styles.playerContent, { transform: [{ rotate: rotation }] }]}>
              <Text style={styles.playerId}>
                {"Player "}
                {player.id}
                {isInitiatingPlayer && " 🎯"}
              </Text>
              
              {commanderDamageDealtToInitiating > 0 && (
                <Pressable 
                  onPress={() => resetCommanderDamage(player.id, initiatingPlayerId)}
                  style={styles.commanderDamageContainer}
                >
                  <Text style={styles.commanderDamageText}>
                    Cmd: {commanderDamageDealtToInitiating}
                  </Text>
                </Pressable>
              )}
              
              <View style={styles.damageSection}>
                <Pressable 
                  style={styles.controlButton}
                  onPress={() => adjustDamage(player.id, -1)}
                >
                  <Ionicons name="remove" size={30} color="white" />
                </Pressable>
                
                <Text style={styles.damageValue}>{damage}</Text>
                
                <Pressable 
                  style={styles.controlButton}
                  onPress={() => adjustDamage(player.id, 1)}
                >
                  <Ionicons name="add" size={30} color="white" />
                </Pressable>
              </View>
      
              <View style={styles.partnerSection}>
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
        animationType="slide"
        onRequestClose={handleClose}
      >
        <StatusBar hidden />
        <View style={styles.container}>
          <View style={styles.topRow}>
            {renderPlayerSection(players[0], 0, true, true)}
            {renderPlayerSection(players[1], 1, true, false)}
          </View>
  
          <View style={styles.middleSection}>
            <Pressable style={styles.gameButton} onPress={handleClose}>
              <Text style={styles.gameButtonText}>GAME</Text>
            </Pressable>
            
            <Pressable style={styles.resetButton} onPress={resetAllDamage}>
              <Text style={styles.resetButtonText}>RESET</Text>
            </Pressable>
            
            <Pressable style={styles.optionsButton}>
              <Ionicons name="settings" size={24} color="white" />
            </Pressable>
            
            <Pressable style={styles.gameButton} onPress={handleDealDamage}>
              <Text style={styles.gameButtonText}>DEAL</Text>
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
    height: '50%',
    width: '100%',
  },
  damageSection: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: '40%',
    width: '100%',
  },
  playerId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  controlButton: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  damageValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  partnerSection: {
    alignItems: 'center',
    gap: 5,
  },
  partnerLabel: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  middleSection: {
    flexDirection: 'row',
    backgroundColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  gameButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsButton: {
    padding: 10,
  },
  initiatingPlayer: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  
  resetButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#ff4444',
    borderRadius: 5,
  },
  
  resetButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  commanderDamageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  
  commanderDamageText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default DamageScreen;