import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { BookOpen, FileText, Video, Shield, Search, ChevronRight, Download } from 'lucide-react-native';

interface Resource {
  id: string;
  title: string;
  category: string;
  type: 'guide' | 'code' | 'video' | 'safety';
  description: string;
  icon: JSX.Element;
  color: string;
}

export function ResourcesLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const resources: Resource[] = [
    {
      id: '1',
      title: 'NZ Building Code Handbook',
      category: 'Building Codes',
      type: 'code',
      description: 'Comprehensive guide to New Zealand building codes and regulations',
      icon: <FileText color="#3B82F6" size={24} />,
      color: '#3B82F6',
    },
    {
      id: '2',
      title: 'Safety Procedures Guide',
      category: 'Safety',
      type: 'safety',
      description: 'Essential safety guidelines for construction sites',
      icon: <Shield color="#EF4444" size={24} />,
      color: '#EF4444',
    },
    {
      id: '3',
      title: 'Residential Construction Best Practices',
      category: 'Guides',
      type: 'guide',
      description: 'Industry best practices for residential building projects',
      icon: <BookOpen color="#10B981" size={24} />,
      color: '#10B981',
    },
    {
      id: '4',
      title: 'Foundation & Framing Techniques',
      category: 'Tutorials',
      type: 'video',
      description: 'Video tutorial series on foundation and framing work',
      icon: <Video color="#F59E0B" size={24} />,
      color: '#F59E0B',
    },
    {
      id: '5',
      title: 'Earthquake Strengthening Requirements',
      category: 'Building Codes',
      type: 'code',
      description: 'NZ requirements for earthquake-prone building strengthening',
      icon: <FileText color="#3B82F6" size={24} />,
      color: '#3B82F6',
    },
    {
      id: '6',
      title: 'WorkSafe NZ Guidelines',
      category: 'Safety',
      type: 'safety',
      description: 'Official WorkSafe New Zealand construction guidelines',
      icon: <Shield color="#EF4444" size={24} />,
      color: '#EF4444',
    },
    {
      id: '7',
      title: 'Weathertightness Standards',
      category: 'Building Codes',
      type: 'code',
      description: 'NZ weathertightness standards and compliance',
      icon: <FileText color="#3B82F6" size={24} />,
      color: '#3B82F6',
    },
    {
      id: '8',
      title: 'Project Management Templates',
      category: 'Guides',
      type: 'guide',
      description: 'Downloadable templates for construction project management',
      icon: <BookOpen color="#10B981" size={24} />,
      color: '#10B981',
    },
  ];

  const categories = ['all', 'Building Codes', 'Safety', 'Guides', 'Tutorials'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Resources Library</Text>
          <Text style={styles.subtitle}>Construction guides, codes & best practices</Text>
        </View>

        <GlassCard variant="default" style={styles.searchCard}>
          <View style={styles.searchContainer}>
            <Search color="#94A3B8" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search resources..."
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </GlassCard>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive
              ]}>
                {category === 'all' ? 'All' : category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.resourceGrid}>
          {filteredResources.map((resource) => (
            <Pressable key={resource.id} style={styles.resourceCard}>
              <GlassCard variant="default" style={styles.resourceCardInner}>
                <View style={[styles.resourceIcon, { backgroundColor: `${resource.color}20` }]}>
                  {resource.icon}
                </View>

                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>

                <View style={styles.resourceFooter}>
                  <View style={[styles.categoryBadge, { borderColor: resource.color }]}>
                    <Text style={[styles.categoryBadgeText, { color: resource.color }]}>
                      {resource.category}
                    </Text>
                  </View>
                  <ChevronRight color="#94A3B8" size={20} />
                </View>
              </GlassCard>
            </Pressable>
          ))}
        </View>

        {filteredResources.length === 0 && (
          <GlassCard variant="default" style={styles.emptyState}>
            <BookOpen color="#94A3B8" size={48} />
            <Text style={styles.emptyStateTitle}>No resources found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filter criteria
            </Text>
          </GlassCard>
        )}

        <GlassCard variant="cyan" style={styles.infoCard}>
          <Text style={styles.infoTitle}>Need More Resources?</Text>
          <Text style={styles.infoText}>
            We're constantly adding new guides, tutorials, and resources. Check back regularly for updates or contact support to request specific content.
          </Text>
          <Pressable style={styles.requestButton}>
            <Text style={styles.requestButtonText}>Request Resource</Text>
          </Pressable>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  searchCard: {
    padding: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
  },
  categoryScroll: {
    marginBottom: 24,
  },
  categoryContainer: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryChipActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  categoryChipTextActive: {
    color: '#3B82F6',
  },
  resourceGrid: {
    gap: 12,
    marginBottom: 24,
  },
  resourceCard: {
    marginBottom: 0,
  },
  resourceCardInner: {
    padding: 16,
  },
  resourceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  resourceDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 16,
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
  },
  infoCard: {
    padding: 20,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#06B6D4',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    lineHeight: 20,
    marginBottom: 16,
  },
  requestButton: {
    backgroundColor: '#06B6D4',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  requestButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
});
