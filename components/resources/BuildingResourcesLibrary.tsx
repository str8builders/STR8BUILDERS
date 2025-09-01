import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { BookOpen, FileText, Download, Search, Star, Clock, Tag, ExternalLink, X, Filter, ChevronRight, Building, Hammer, Zap, Droplets, Shield, Calculator, Eye, Share } from 'lucide-react-native';

interface Resource {
  id: string;
  title: string;
  category: string;
  type: 'standard' | 'guide' | 'calculator' | 'checklist' | 'template' | 'regulation';
  description: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  lastAccessed?: Date;
  downloadUrl?: string;
  externalUrl?: string;
}

export const BuildingResourcesLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All Resources', icon: <BookOpen color="#3B82F6" size={20} />, count: 0 },
    { id: 'building-code', name: 'Building Code', icon: <Shield color="#EF4444" size={20} />, count: 0 },
    { id: 'structural', name: 'Structural', icon: <Building color="#10B981" size={20} />, count: 0 },
    { id: 'electrical', name: 'Electrical', icon: <Zap color="#F59E0B" size={20} />, count: 0 },
    { id: 'plumbing', name: 'Plumbing', icon: <Droplets color="#06B6D4" size={20} />, count: 0 },
    { id: 'tools', name: 'Tools & Equipment', icon: <Hammer color="#8B5CF6" size={20} />, count: 0 },
    { id: 'calculations', name: 'Calculations', icon: <Calculator color="#14B8A6" size={20} />, count: 0 },
  ];

  const resources: Resource[] = [
    // Building Code Resources
    {
      id: 'nzbc-h1',
      title: 'NZBC H1 - Energy Efficiency',
      category: 'building-code',
      type: 'standard',
      description: 'New Zealand Building Code requirements for energy efficiency in residential and commercial buildings.',
      content: `# NZBC H1 - Energy Efficiency

## Key Requirements:
- **R-values for different climate zones**
- **Window performance standards**
- **Air leakage requirements**
- **Thermal bridging considerations**

## Climate Zones:
- **Zone 1**: Northland, Auckland, Bay of Plenty
- **Zone 2**: Waikato, Gisborne, Hawke's Bay
- **Zone 3**: Taranaki, Manawatu, Wellington
- **Zone 4**: Nelson, Marlborough, Canterbury
- **Zone 5**: West Coast, Otago
- **Zone 6**: Southland, Central Otago

## Minimum R-values (Zone 1):
- **Roof**: R2.9
- **Walls**: R1.9
- **Floor**: R1.3
- **Windows**: R0.26

## Compliance Methods:
1. **Calculation Method** - Detailed thermal modeling
2. **Schedule Method** - Prescriptive requirements
3. **Modeling Method** - Whole building energy modeling`,
      tags: ['building-code', 'energy', 'insulation', 'compliance'],
      isFavorite: false,
    },
    {
      id: 'nzbc-b1',
      title: 'NZBC B1 - Structure',
      category: 'building-code',
      type: 'standard',
      description: 'Structural requirements and load calculations for New Zealand buildings.',
      content: `# NZBC B1 - Structure

## Load Requirements:
- **Dead Loads**: Permanent building elements
- **Live Loads**: Occupancy and use loads
- **Wind Loads**: AS/NZS 1170.2
- **Earthquake Loads**: AS/NZS 1170.5

## Design Standards:
- **Timber**: NZS 3603
- **Steel**: AS/NZS 4600, AS 4100
- **Concrete**: AS 3600, NZS 3101
- **Masonry**: AS 3700

## Key Load Values:
- **Residential Floor**: 1.5 kPa
- **Residential Roof**: 0.25 kPa + snow
- **Wind Speed**: Regional variations
- **Seismic Zone Factor**: 0.13-0.36`,
      tags: ['building-code', 'structural', 'loads', 'design'],
      isFavorite: false,
    },
    {
      id: 'nzbc-e2',
      title: 'NZBC E2 - External Moisture',
      category: 'building-code',
      type: 'standard',
      description: 'Requirements for preventing external moisture penetration in buildings.',
      content: `# NZBC E2 - External Moisture

## Key Principles:
- **Shed water** away from building
- **Resist penetration** of moisture
- **Avoid moisture accumulation**
- **Drain any moisture** that does penetrate

## Cladding Systems:
- **Face-sealed systems**
- **Drained and ventilated systems**
- **Mass systems**

## Critical Details:
- **Window and door flashings**
- **Roof/wall junctions**
- **Penetration sealing**
- **Ground clearances**

## Minimum Requirements:
- **Ground clearance**: 150mm to timber
- **Deck clearance**: 225mm to timber
- **Flashing laps**: 75mm minimum`,
      tags: ['building-code', 'moisture', 'cladding', 'weatherproofing'],
      isFavorite: false,
    },

    // Structural Resources
    {
      id: 'timber-spans',
      title: 'NZ Timber Span Tables',
      category: 'structural',
      type: 'guide',
      description: 'Comprehensive span tables for NZ timber grades and sizes.',
      content: `# NZ Timber Span Tables

## Radiata Pine Grades:
- **SG8**: Structural grade 8 MPa
- **SG10**: Structural grade 10 MPa
- **SG12**: Structural grade 12 MPa

## Floor Joist Spans (SG8):
- **90x45**: 2.4m @ 450 centers
- **140x45**: 3.6m @ 450 centers
- **190x45**: 4.8m @ 450 centers
- **240x45**: 6.0m @ 450 centers

## Rafter Spans (SG8):
- **90x45**: 2.1m @ 600 centers
- **140x45**: 3.3m @ 600 centers
- **190x45**: 4.4m @ 600 centers

## Load Assumptions:
- **Dead Load**: 0.5 kPa
- **Live Load**: 1.5 kPa (floors), 0.25 kPa (roofs)
- **Deflection**: L/300 (floors), L/250 (roofs)`,
      tags: ['timber', 'spans', 'structural', 'nz-standards'],
      isFavorite: false,
    },
    {
      id: 'foundation-guide',
      title: 'Foundation Design Guide',
      category: 'structural',
      type: 'guide',
      description: 'Foundation design principles and requirements for NZ conditions.',
      content: `# Foundation Design Guide

## Foundation Types:
- **Concrete slab on ground**
- **Suspended concrete slab**
- **Timber piles**
- **Concrete piles**
- **Strip footings**

## Soil Bearing Capacities:
- **Rock**: 1000+ kPa
- **Dense sand/gravel**: 300-600 kPa
- **Medium sand**: 150-300 kPa
- **Stiff clay**: 150-300 kPa
- **Soft clay**: 75-150 kPa

## Minimum Requirements:
- **Footing width**: 450mm minimum
- **Depth below ground**: 450mm minimum
- **Reinforcement**: N12 bars minimum
- **Concrete strength**: 20 MPa minimum

## Special Considerations:
- **Liquefaction zones**
- **Expansive soils**
- **Sloping sites**
- **High water table**`,
      tags: ['foundations', 'soil', 'concrete', 'design'],
      isFavorite: false,
    },

    // Electrical Resources
    {
      id: 'electrical-standards',
      title: 'NZ Electrical Standards (AS/NZS 3000)',
      category: 'electrical',
      type: 'standard',
      description: 'Wiring rules and electrical installation standards for New Zealand.',
      content: `# AS/NZS 3000 - Electrical Installations

## Cable Current Ratings:
- **1.5mm²**: 16A (lighting circuits)
- **2.5mm²**: 20A (power circuits)
- **4mm²**: 25A (heavy appliances)
- **6mm²**: 32A (electric hot water)

## Circuit Protection:
- **Lighting**: 10A or 16A MCB
- **Power outlets**: 20A MCB
- **Hot water**: 20A or 25A MCB
- **Oven**: 32A MCB

## Installation Requirements:
- **Cable in walls**: 50mm from surface
- **Cable protection**: Conduit or sheathing
- **Earth bonding**: All metalwork
- **RCD protection**: All circuits

## Testing Requirements:
- **Insulation resistance**: >1MΩ
- **Earth continuity**: <0.5Ω
- **RCD operation**: 30mA in 300ms`,
      tags: ['electrical', 'standards', 'wiring', 'safety'],
      isFavorite: false,
    },
    {
      id: 'switchboard-layout',
      title: 'Switchboard Layout Guide',
      category: 'electrical',
      type: 'template',
      description: 'Standard switchboard layouts and circuit arrangements.',
      content: `# Switchboard Layout Guide

## Standard Residential Layout:
1. **Main Switch** (63A or 80A)
2. **RCD** (30mA, 63A)
3. **Lighting circuits** (10A MCB)
4. **Power circuits** (20A MCB)
5. **Hot water** (20A MCB)
6. **Oven** (32A MCB)
7. **Heat pump** (20A MCB)

## Circuit Labeling:
- **Clear identification** required
- **Durable labels** (not handwritten)
- **Circuit purpose** clearly stated
- **Load details** where applicable

## Safety Requirements:
- **IP rating**: IP2X minimum
- **Working space**: 600mm minimum
- **Height**: 1.2-2.0m to switches
- **Lighting**: Adequate illumination`,
      tags: ['electrical', 'switchboard', 'layout', 'safety'],
      isFavorite: false,
    },

    // Plumbing Resources
    {
      id: 'plumbing-standards',
      title: 'NZ Plumbing Standards (AS/NZS 3500)',
      category: 'plumbing',
      type: 'standard',
      description: 'Plumbing and drainage standards for New Zealand installations.',
      content: `# AS/NZS 3500 - Plumbing & Drainage

## Pipe Sizing:
- **Cold water main**: 25mm minimum
- **Hot water**: 20mm to fixtures
- **Waste pipes**: 40mm minimum
- **Soil pipes**: 100mm minimum

## Drainage Slopes:
- **100mm pipes**: 1:60 minimum (1.67%)
- **150mm pipes**: 1:80 minimum (1.25%)
- **Stormwater**: 1:100 minimum (1%)

## Fixture Requirements:
- **Toilet**: 100mm waste, S or P trap
- **Basin**: 32mm waste, P trap
- **Shower**: 40mm waste, floor waste
- **Kitchen sink**: 40mm waste, P trap

## Water Pressure:
- **Minimum**: 150 kPa at fixtures
- **Maximum**: 500 kPa (pressure limiting required)
- **Hot water**: 60°C maximum delivery`,
      tags: ['plumbing', 'standards', 'drainage', 'water-supply'],
      isFavorite: false,
    },

    // Tools & Equipment
    {
      id: 'tool-safety-checklist',
      title: 'Tool Safety Checklist',
      category: 'tools',
      type: 'checklist',
      description: 'Daily safety checks for construction tools and equipment.',
      content: `# Tool Safety Checklist

## Power Tools Daily Check:
- [ ] **Guards in place** and secure
- [ ] **Cords undamaged** - no cuts or exposed wires
- [ ] **Switches operating** correctly
- [ ] **Blades/bits sharp** and properly secured
- [ ] **Safety equipment** available (glasses, gloves)

## Hand Tools Check:
- [ ] **Handles secure** - no loose or cracked handles
- [ ] **Cutting edges sharp** and clean
- [ ] **Moving parts** lubricated and functioning
- [ ] **Storage** clean and organized

## Ladder Safety:
- [ ] **3:1 ratio** setup (height:base distance)
- [ ] **Level ground** and stable footing
- [ ] **Top extends** 1m above landing
- [ ] **Both hands free** when climbing
- [ ] **Weight limit** not exceeded

## PPE Requirements:
- [ ] **Hard hat** on all sites
- [ ] **Safety glasses** when required
- [ ] **High-vis clothing** in traffic areas
- [ ] **Steel-capped boots** mandatory`,
      tags: ['safety', 'tools', 'checklist', 'ppe'],
      isFavorite: false,
    },
    {
      id: 'equipment-maintenance',
      title: 'Equipment Maintenance Schedule',
      category: 'tools',
      type: 'template',
      description: 'Maintenance schedules for construction equipment and tools.',
      content: `# Equipment Maintenance Schedule

## Daily Maintenance:
- **Visual inspection** of all equipment
- **Fluid level checks** (oil, hydraulic, coolant)
- **Tire pressure** and condition
- **Safety device** functionality
- **Clean equipment** after use

## Weekly Maintenance:
- **Grease all fittings** as per manual
- **Check belt tension** and condition
- **Inspect filters** (air, fuel, hydraulic)
- **Battery terminals** clean and tight
- **Hour meter readings** recorded

## Monthly Maintenance:
- **Oil changes** as per schedule
- **Filter replacements**
- **Hydraulic system** inspection
- **Electrical connections** check
- **Calibration** of measuring tools

## Annual Maintenance:
- **Professional service** and certification
- **Load testing** of lifting equipment
- **Electrical testing** and tagging
- **Warranty** and insurance reviews`,
      tags: ['maintenance', 'equipment', 'schedule', 'safety'],
      isFavorite: false,
    },

    // Calculation Resources
    {
      id: 'load-calculations',
      title: 'Structural Load Calculations',
      category: 'calculations',
      type: 'calculator',
      description: 'Standard load calculations for NZ building structures.',
      content: `# Structural Load Calculations

## Dead Loads (kPa):
- **Concrete slab**: 24 kPa per m thickness
- **Timber floor**: 0.5 kPa
- **Roofing iron**: 0.15 kPa
- **Concrete tiles**: 0.8 kPa
- **Plasterboard ceiling**: 0.2 kPa

## Live Loads (kPa):
- **Residential floors**: 1.5 kPa
- **Residential balconies**: 3.0 kPa
- **Commercial floors**: 3.0-5.0 kPa
- **Roof access**: 0.25 kPa
- **Public assembly**: 5.0 kPa

## Wind Load Calculation:
**W = 0.5 × ρ × V² × Cp × Cg**

Where:
- **ρ**: Air density (1.2 kg/m³)
- **V**: Design wind speed (m/s)
- **Cp**: Pressure coefficient
- **Cg**: Gust factor

## Seismic Loads:
**F = C(T) × W**

Where:
- **C(T)**: Seismic coefficient
- **W**: Building weight
- **T**: Building period`,
      tags: ['calculations', 'loads', 'structural', 'design'],
      isFavorite: false,
    },
    {
      id: 'concrete-mix-designs',
      title: 'Concrete Mix Designs',
      category: 'calculations',
      type: 'guide',
      description: 'Standard concrete mix designs for different applications.',
      content: `# Concrete Mix Designs

## Standard Mixes (per m³):

### **20 MPa General Purpose:**
- **Cement**: 280 kg
- **Sand**: 750 kg
- **Aggregate**: 1200 kg
- **Water**: 180 L
- **W/C Ratio**: 0.64

### **25 MPa Structural:**
- **Cement**: 320 kg
- **Sand**: 720 kg
- **Aggregate**: 1180 kg
- **Water**: 175 L
- **W/C Ratio**: 0.55

### **30 MPa High Strength:**
- **Cement**: 380 kg
- **Sand**: 680 kg
- **Aggregate**: 1150 kg
- **Water**: 170 L
- **W/C Ratio**: 0.45

## Admixtures:
- **Plasticizer**: 0.2-0.5% by cement weight
- **Retarder**: Hot weather conditions
- **Accelerator**: Cold weather conditions
- **Air entrainer**: Freeze-thaw protection

## Quality Control:
- **Slump test**: 80-120mm typical
- **Compressive strength**: 28-day test
- **Temperature**: 5-35°C placement`,
      tags: ['concrete', 'mix-design', 'strength', 'quality'],
      isFavorite: false,
    },

    // Additional Resources
    {
      id: 'weatherproofing-guide',
      title: 'Weatherproofing Best Practices',
      category: 'building-code',
      type: 'guide',
      description: 'Best practices for weatherproofing buildings in NZ climate.',
      content: `# Weatherproofing Best Practices

## Critical Areas:
- **Roof/wall junctions**
- **Window and door openings**
- **Deck attachments**
- **Service penetrations**

## Flashing Requirements:
- **Material**: Minimum 0.55mm steel or aluminum
- **Laps**: 75mm minimum overlap
- **Fixings**: Appropriate for substrate
- **Sealants**: Compatible materials only

## Membrane Installation:
- **Overlap**: 150mm minimum
- **Taping**: All joints sealed
- **Penetrations**: Properly detailed
- **Inspection**: Before covering

## Common Failures:
- **Inadequate laps** in flashings
- **Missing or damaged** building wrap
- **Poor sealing** around penetrations
- **Incorrect fall** on horizontal surfaces`,
      tags: ['weatherproofing', 'flashing', 'building-wrap', 'moisture'],
      isFavorite: false,
    },
    {
      id: 'fire-rating-guide',
      title: 'Fire Rating Requirements',
      category: 'building-code',
      type: 'standard',
      description: 'Fire rating requirements for different building elements.',
      content: `# Fire Rating Requirements

## Fire Resistance Periods:
- **Structural elements**: 30-120 minutes
- **Fire separations**: 30-60 minutes
- **Escape routes**: 30-60 minutes
- **Service penetrations**: Match wall rating

## Common Ratings:
- **Timber frame wall**: 30 minutes with plasterboard
- **Concrete block**: 60-120 minutes
- **Steel frame**: 30-60 minutes with protection
- **Concrete slab**: 60-120 minutes

## Protection Methods:
- **Plasterboard**: 13mm = 30 min, 16mm = 45 min
- **Intumescent paint**: Steel protection
- **Concrete cover**: 25-50mm to reinforcement
- **Fire-rated doors**: Self-closing hardware

## Testing Standards:
- **AS 1530.4**: Fire resistance test
- **AS 1905**: Components and assemblies
- **Certification**: Required for all systems`,
      tags: ['fire-rating', 'safety', 'building-code', 'protection'],
      isFavorite: false,
    },
    {
      id: 'site-safety-plan',
      title: 'Site Safety Management Plan',
      category: 'tools',
      type: 'template',
      description: 'Template for comprehensive site safety management.',
      content: `# Site Safety Management Plan

## Daily Safety Briefing:
- [ ] **Weather conditions** and impacts
- [ ] **Work activities** planned for day
- [ ] **Hazards identified** and controls
- [ ] **PPE requirements** confirmed
- [ ] **Emergency procedures** reviewed

## Hazard Identification:
- **Working at height** - fall protection required
- **Electrical work** - isolation and testing
- **Excavation** - cave-in protection
- **Manual handling** - lifting techniques
- **Noise exposure** - hearing protection

## Emergency Procedures:
- **Emergency contacts** displayed
- **First aid kit** location and contents
- **Evacuation routes** clearly marked
- **Incident reporting** procedures
- **Emergency assembly** point designated

## Documentation:
- **Toolbox talks** recorded
- **Incident reports** completed
- **Safety inspections** documented
- **Training records** maintained`,
      tags: ['safety', 'management', 'hazards', 'emergency'],
      isFavorite: false,
    },
    {
      id: 'material-specifications',
      title: 'NZ Material Specifications',
      category: 'structural',
      type: 'guide',
      description: 'Standard material specifications for NZ construction.',
      content: `# NZ Material Specifications

## Timber Specifications:
- **Framing**: MSG8 or SG8 minimum
- **Structural**: SG10 or SG12 for spans
- **Treatment**: H1.2 for internal, H3.2 for external
- **Moisture content**: <18% at installation

## Steel Specifications:
- **Reinforcement**: Grade 500E (500 MPa)
- **Structural steel**: Grade 300 (300 MPa)
- **Mesh**: SL72, SL82, SL92 standard
- **Galvanizing**: AS/NZS 4680

## Concrete Specifications:
- **Residential**: 20 MPa minimum
- **Commercial**: 25-32 MPa typical
- **Exposure**: Normal, moderate, severe
- **Slump**: 80-120mm workable

## Insulation Materials:
- **Bulk insulation**: R-values as per H1
- **Reflective**: Combined with bulk
- **Vapor barriers**: Where required
- **Installation**: Gap-free, full coverage`,
      tags: ['materials', 'specifications', 'standards', 'quality'],
      isFavorite: false,
    },
  ];

  // Update category counts
  categories.forEach(category => {
    if (category.id === 'all') {
      category.count = resources.length;
    } else {
      category.count = resources.filter(r => r.category === category.id).length;
    }
  });

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (resourceId: string) => {
    setFavorites(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleResourceAccess = (resource: Resource) => {
    setSelectedResource(resource);
    // Update last accessed time
    resource.lastAccessed = new Date();
  };

  const handleDownload = (resource: Resource) => {
    Alert.alert(
      'Download Resource',
      `Download "${resource.title}" as PDF for offline access?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => {
          Alert.alert('Success', 'Resource downloaded to device storage');
        }}
      ]
    );
  };

  const handleShare = (resource: Resource) => {
    Alert.alert(
      'Share Resource',
      `Share "${resource.title}" with team members?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share Link', onPress: () => {
          Alert.alert('Success', 'Resource link copied to clipboard');
        }},
        { text: 'Export PDF', onPress: () => {
          Alert.alert('Success', 'PDF exported and ready to share');
        }}
      ]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'standard': return <Shield color="#EF4444" size={16} />;
      case 'guide': return <BookOpen color="#10B981" size={16} />;
      case 'calculator': return <Calculator color="#3B82F6" size={16} />;
      case 'checklist': return <FileText color="#F59E0B" size={16} />;
      case 'template': return <FileText color="#06B6D4" size={16} />;
      case 'regulation': return <Shield color="#8B5CF6" size={16} />;
      default: return <FileText color="#94A3B8" size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return '#EF4444';
      case 'guide': return '#10B981';
      case 'calculator': return '#3B82F6';
      case 'checklist': return '#F59E0B';
      case 'template': return '#06B6D4';
      case 'regulation': return '#8B5CF6';
      default: return '#94A3B8';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Building Resources</Text>
        <View style={styles.headerActions}>
          <Pressable 
            style={styles.searchButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Search color="#FFF" size={20} />
          </Pressable>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search resources, standards, guides..."
            placeholderTextColor="#64748B"
            autoFocus
          />
        </View>
      )}

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.selectedCategoryChip
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            {category.icon}
            <Text style={[
              styles.categoryChipText,
              selectedCategory === category.id && styles.selectedCategoryChipText
            ]}>
              {category.name} ({category.count})
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Resources List */}
      <ScrollView style={styles.resourcesList} showsVerticalScrollIndicator={false}>
        {filteredResources.length === 0 ? (
          <GlassCard variant="default" style={styles.emptyState}>
            <BookOpen color="#94A3B8" size={48} />
            <Text style={styles.emptyTitle}>No Resources Found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 'Try adjusting your search terms' : 'No resources in this category'}
            </Text>
          </GlassCard>
        ) : (
          filteredResources.map((resource) => (
            <GlassCard key={resource.id} variant="default" style={styles.resourceCard}>
              <Pressable onPress={() => handleResourceAccess(resource)}>
                <View style={styles.resourceHeader}>
                  <View style={styles.resourceInfo}>
                    <View style={styles.resourceTitleRow}>
                      <View style={[styles.typeIcon, { backgroundColor: `${getTypeColor(resource.type)}20` }]}>
                        {getTypeIcon(resource.type)}
                      </View>
                      <Text style={styles.resourceTitle}>{resource.title}</Text>
                      <Pressable onPress={() => toggleFavorite(resource.id)}>
                        <Star 
                          color={favorites.includes(resource.id) ? '#F59E0B' : '#64748B'} 
                          size={16}
                          fill={favorites.includes(resource.id) ? '#F59E0B' : 'none'}
                        />
                      </Pressable>
                    </View>
                    <Text style={styles.resourceDescription}>{resource.description}</Text>
                  </View>
                </View>

                <View style={styles.resourceTags}>
                  {resource.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                  {resource.tags.length > 3 && (
                    <Text style={styles.moreTagsText}>+{resource.tags.length - 3} more</Text>
                  )}
                </View>

                <View style={styles.resourceActions}>
                  <View style={styles.resourceMeta}>
                    <View style={[styles.typeBadge, { backgroundColor: getTypeColor(resource.type) }]}>
                      <Text style={styles.typeBadgeText}>{resource.type.toUpperCase()}</Text>
                    </View>
                    {resource.lastAccessed && (
                      <Text style={styles.lastAccessed}>
                        Last viewed: {resource.lastAccessed.toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <Pressable 
                      style={styles.actionButton}
                      onPress={() => handleDownload(resource)}
                    >
                      <Download color="#94A3B8" size={16} />
                    </Pressable>
                    
                    <Pressable 
                      style={styles.actionButton}
                      onPress={() => handleShare(resource)}
                    >
                      <Share color="#94A3B8" size={16} />
                    </Pressable>
                    
                    <ChevronRight color="#94A3B8" size={16} />
                  </View>
                </View>
              </Pressable>
            </GlassCard>
          ))
        )}
      </ScrollView>

      {/* Resource Detail Modal */}
      <Modal
        visible={selectedResource !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedResource(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>{selectedResource?.title}</Text>
                <View style={[
                  styles.typeBadge, 
                  { backgroundColor: selectedResource ? getTypeColor(selectedResource.type) : '#94A3B8' }
                ]}>
                  <Text style={styles.typeBadgeText}>
                    {selectedResource?.type.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.modalHeaderActions}>
                <Pressable onPress={() => selectedResource && toggleFavorite(selectedResource.id)}>
                  <Star 
                    color={selectedResource && favorites.includes(selectedResource.id) ? '#F59E0B' : '#64748B'} 
                    size={20}
                    fill={selectedResource && favorites.includes(selectedResource.id) ? '#F59E0B' : 'none'}
                  />
                </Pressable>
                <Pressable onPress={() => setSelectedResource(null)}>
                  <X color="#94A3B8" size={24} />
                </Pressable>
              </View>
            </View>

            <ScrollView style={styles.resourceContent}>
              <Text style={styles.resourceContentText}>
                {selectedResource?.content}
              </Text>

              <View style={styles.resourceTagsContainer}>
                <Text style={styles.tagsTitle}>Tags:</Text>
                <View style={styles.allTags}>
                  {selectedResource?.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable 
                style={styles.downloadButton}
                onPress={() => selectedResource && handleDownload(selectedResource)}
              >
                <Download color="#FFF" size={16} />
                <Text style={styles.downloadButtonText}>Download PDF</Text>
              </Pressable>
              
              <Pressable 
                style={styles.shareButton}
                onPress={() => selectedResource && handleShare(selectedResource)}
              >
                <Share color="#FFF" size={16} />
                <Text style={styles.shareButtonText}>Share</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 8,
  },
  selectedCategoryChip: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  selectedCategoryChipText: {
    color: '#FFF',
  },
  resourcesList: {
    flex: 1,
  },
  resourceCard: {
    marginVertical: 0,
    marginBottom: 16,
  },
  resourceHeader: {
    marginBottom: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    flex: 1,
  },
  resourceDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 20,
  },
  resourceTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  moreTagsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    alignSelf: 'center',
  },
  resourceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  lastAccessed: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  emptyState: {
    marginVertical: 0,
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1b3a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  resourceContent: {
    flex: 1,
    marginBottom: 20,
  },
  resourceContentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 22,
    marginBottom: 20,
  },
  resourceTagsContainer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  tagsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 12,
  },
  allTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
});