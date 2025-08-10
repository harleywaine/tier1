import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface AccountSectionCardProps {
  title: string;
  children: React.ReactNode;
  onEditPress?: () => void;
  isEditing?: boolean;
  onSavePress?: () => void;
  onCancelPress?: () => void;
  saveLoading?: boolean;
  style?: ViewStyle;
}

export const AccountSectionCard: React.FC<AccountSectionCardProps> = ({
  title,
  children,
  onEditPress,
  isEditing = false,
  onSavePress,
  onCancelPress,
  saveLoading = false,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        {onEditPress && !isEditing && (
          <TouchableOpacity onPress={onEditPress}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        )}
        {isEditing && onSavePress && onCancelPress && (
          <View style={styles.editActions}>
            <TouchableOpacity onPress={onCancelPress} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSavePress} style={styles.saveButton} disabled={saveLoading}>
              <Text style={styles.saveButtonText}>{saveLoading ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'SFProDisplay-Regular',
    color: Colors.text.primary,
  },
  editButton: {
    color: Colors.text.accent,
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
    backgroundColor: Colors.button.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 10,
    backgroundColor: Colors.button.danger,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: Colors.text.accent,
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
  },
  saveButton: {
    backgroundColor: Colors.button.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
  },
  cardContent: {
    // Content styling will be handled by children
  },
});
