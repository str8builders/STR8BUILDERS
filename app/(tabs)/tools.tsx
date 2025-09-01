import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Calculator, Hammer, Chrome as Home, Droplets, Zap, Shield, Thermometer, Wrench, Camera, Cuboid as Cube, X, ChevronRight, Info } from 'lucide-react-native';

interface Calculator {
  id: string;
  name: string;
  description: string;
  category: string;
  inputs: CalculatorInput[];
  formula: (inputs: Record<string, number>) => number | { [key: string]: number };
  unit?: string;
  resultLabel?: string;
}

interface CalculatorInput {
  id: string;
  label: string;
  placeholder: string;
  unit?: string;
  type?: 'number' | 'select';
  options?: string[];
}

export default function Tools() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCalculator, setSelectedCalculator] = useState<Calculator | null>(null);
  const [calculatorInputs, setCalculatorInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any>(null);

  const categories = [
    {
      id: 'concrete',
      name: 'Concrete & Masonry',
      icon: <Cube color="#8B5CF6" size={24} />,
      color: '#8B5CF6',
      description: 'Volume, blocks, slabs, rebar, mortar calculations'
    },
    {
      id: 'framing',
      name: 'Framing & Carpentry',
      icon: <Hammer color="#F59E0B" size={24} />,
      color: '#F59E0B',
      description: 'Studs, rafters, joists, deck materials, sheet coverage'
    },
    {
      id: 'plumbing',
      name: 'Plumbing & Drainage',
      icon: <Droplets color="#3B82F6" size={24} />,
      color: '#3B82F6',
      description: 'Pipe sizing, flow rates, slopes, trenching'
    },
    {
      id: 'electrical',
      name: 'Electrical',
      icon: <Zap color="#EF4444" size={24} />,
      color: '#EF4444',
      description: 'Cable sizing, voltage drop, breakers, lighting loads'
    },
    {
      id: 'roofing',
      name: 'Roofing & Cladding',
      icon: <Home color="#10B981" size={24} />,
      color: '#10B981',
      description: 'Roofing sheets, tiles, siding, paint coverage'
    },
    {
      id: 'insulation',
      name: 'Insulation & Thermal',
      icon: <Thermometer color="#06B6D4" size={24} />,
      color: '#06B6D4',
      description: 'R-values, insulation coverage, thermal bridging'
    },
    {
      id: 'general',
      name: 'General Construction',
      icon: <Calculator color="#14B8A6" size={24} />,
      color: '#14B8A6',
      description: 'Costs, labor, waste, project timelines'
    },
    {
      id: 'advanced',
      name: 'Advanced Tools',
      icon: <Camera color="#EC4899" size={24} />,
      color: '#EC4899',
      description: 'AR measurement, 3D models, smart notes'
    },
  ];

  const calculators: Calculator[] = [
    // Concrete & Masonry
    {
      id: 'concrete-volume',
      name: 'Concrete Volume Calculator',
      description: 'Calculate cubic meters of concrete needed',
      category: 'concrete',
      inputs: [
        { id: 'length', label: 'Length', placeholder: '10', unit: 'm' },
        { id: 'width', label: 'Width', placeholder: '5', unit: 'm' },
        { id: 'depth', label: 'Depth/Thickness', placeholder: '0.1', unit: 'm' },
      ],
      formula: (inputs) => inputs.length * inputs.width * inputs.depth,
      unit: 'm³',
      resultLabel: 'Concrete Volume'
    },
    {
      id: 'block-wall',
      name: 'Block Wall Calculator',
      description: 'Calculate blocks needed for wall construction',
      category: 'concrete',
      inputs: [
        { id: 'wallLength', label: 'Wall Length', placeholder: '10', unit: 'm' },
        { id: 'wallHeight', label: 'Wall Height', placeholder: '2.4', unit: 'm' },
        { id: 'blockLength', label: 'Block Length', placeholder: '0.4', unit: 'm' },
        { id: 'blockHeight', label: 'Block Height', placeholder: '0.2', unit: 'm' },
      ],
      formula: (inputs) => {
        const blocksPerRow = Math.ceil(inputs.wallLength / inputs.blockLength);
        const rows = Math.ceil(inputs.wallHeight / inputs.blockHeight);
        return blocksPerRow * rows;
      },
      unit: 'blocks',
      resultLabel: 'Blocks Needed'
    },
    {
      id: 'slab-pour',
      name: 'Slab Pour Estimator',
      description: 'Estimate concrete and materials for slab',
      category: 'concrete',
      inputs: [
        { id: 'length', label: 'Length', placeholder: '12', unit: 'm' },
        { id: 'width', label: 'Width', placeholder: '8', unit: 'm' },
        { id: 'thickness', label: 'Thickness', placeholder: '0.1', unit: 'm' },
      ],
      formula: (inputs) => {
        const volume = inputs.length * inputs.width * inputs.thickness;
        const wastage = volume * 1.1; // 10% wastage
        return {
          volume: volume,
          withWastage: wastage,
          bags: Math.ceil(wastage * 40), // ~40 bags per m³
        };
      },
      resultLabel: 'Slab Requirements'
    },
    {
      id: 'rebar-spacing',
      name: 'Rebar Spacing & Cutting List',
      description: 'Calculate rebar requirements and cutting list',
      category: 'concrete',
      inputs: [
        { id: 'slabLength', label: 'Slab Length', placeholder: '10', unit: 'm' },
        { id: 'slabWidth', label: 'Slab Width', placeholder: '8', unit: 'm' },
        { id: 'spacing', label: 'Rebar Spacing', placeholder: '0.3', unit: 'm' },
      ],
      formula: (inputs) => {
        const lengthBars = Math.ceil(inputs.slabWidth / inputs.spacing) + 1;
        const widthBars = Math.ceil(inputs.slabLength / inputs.spacing) + 1;
        const totalLength = (lengthBars * inputs.slabLength) + (widthBars * inputs.slabWidth);
        return {
          lengthBars: lengthBars,
          widthBars: widthBars,
          totalLength: totalLength,
          standardBars: Math.ceil(totalLength / 6), // 6m standard bars
        };
      },
      resultLabel: 'Rebar Requirements'
    },
    {
      id: 'mortar-grout',
      name: 'Mortar & Grout Estimator',
      description: 'Calculate mortar and grout quantities',
      category: 'concrete',
      inputs: [
        { id: 'wallArea', label: 'Wall Area', placeholder: '50', unit: 'm²' },
        { id: 'jointThickness', label: 'Joint Thickness', placeholder: '10', unit: 'mm' },
        { id: 'blockType', label: 'Block Type', placeholder: 'Standard', type: 'select', options: ['Standard', 'Hollow', 'Solid'] },
      ],
      formula: (inputs) => {
        const mortarPerM2 = inputs.jointThickness * 0.02; // Simplified calculation
        const totalMortar = inputs.wallArea * mortarPerM2;
        return {
          mortar: totalMortar,
          bags: Math.ceil(totalMortar * 50), // ~50 bags per m³
        };
      },
      resultLabel: 'Mortar Requirements'
    },

    // Framing & Carpentry
    {
      id: 'stud-spacing',
      name: 'Stud Spacing Calculator',
      description: 'Calculate number of studs needed',
      category: 'framing',
      inputs: [
        { id: 'wallLength', label: 'Wall Length', placeholder: '10', unit: 'm' },
        { id: 'studSpacing', label: 'Stud Spacing', placeholder: '0.6', unit: 'm' },
        { id: 'studLength', label: 'Stud Length', placeholder: '2.4', unit: 'm' },
      ],
      formula: (inputs) => {
        const studsNeeded = Math.floor(inputs.wallLength / inputs.studSpacing) + 1;
        const totalLinearMeters = studsNeeded * inputs.studLength;
        return {
          studs: studsNeeded,
          linearMeters: totalLinearMeters,
        };
      },
      resultLabel: 'Stud Requirements'
    },
    {
      id: 'rafter-roof',
      name: 'Rafter & Roof Pitch Calculator',
      description: 'Calculate rafter length and roof pitch',
      category: 'framing',
      inputs: [
        { id: 'span', label: 'Roof Span', placeholder: '8', unit: 'm' },
        { id: 'rise', label: 'Roof Rise', placeholder: '2', unit: 'm' },
        { id: 'overhang', label: 'Overhang', placeholder: '0.5', unit: 'm' },
      ],
      formula: (inputs) => {
        const run = inputs.span / 2;
        const rafterLength = Math.sqrt((run * run) + (inputs.rise * inputs.rise)) + inputs.overhang;
        const pitch = Math.atan(inputs.rise / run) * (180 / Math.PI);
        return {
          rafterLength: rafterLength,
          pitch: pitch,
          totalRun: run,
        };
      },
      resultLabel: 'Rafter Calculations'
    },
    {
      id: 'joist-span',
      name: 'Joist Span Calculator',
      description: 'Calculate joist spacing and span requirements',
      category: 'framing',
      inputs: [
        { id: 'floorLength', label: 'Floor Length', placeholder: '12', unit: 'm' },
        { id: 'floorWidth', label: 'Floor Width', placeholder: '8', unit: 'm' },
        { id: 'joistSpacing', label: 'Joist Spacing', placeholder: '0.4', unit: 'm' },
      ],
      formula: (inputs) => {
        const joistsNeeded = Math.floor(inputs.floorLength / inputs.joistSpacing) + 1;
        const totalJoistLength = joistsNeeded * inputs.floorWidth;
        return {
          joists: joistsNeeded,
          totalLength: totalJoistLength,
        };
      },
      resultLabel: 'Joist Requirements'
    },
    {
      id: 'deck-material',
      name: 'Deck Material Estimator',
      description: 'Calculate decking boards and materials',
      category: 'framing',
      inputs: [
        { id: 'deckLength', label: 'Deck Length', placeholder: '6', unit: 'm' },
        { id: 'deckWidth', label: 'Deck Width', placeholder: '4', unit: 'm' },
        { id: 'boardWidth', label: 'Board Width', placeholder: '0.14', unit: 'm' },
      ],
      formula: (inputs) => {
        const area = inputs.deckLength * inputs.deckWidth;
        const boardsNeeded = Math.ceil(inputs.deckWidth / inputs.boardWidth);
        const totalBoardLength = boardsNeeded * inputs.deckLength;
        return {
          area: area,
          boards: boardsNeeded,
          totalLength: totalBoardLength,
        };
      },
      resultLabel: 'Deck Materials'
    },
    {
      id: 'plywood-coverage',
      name: 'Plywood/OSB Sheet Coverage',
      description: 'Calculate sheets needed for coverage',
      category: 'framing',
      inputs: [
        { id: 'totalArea', label: 'Total Area', placeholder: '100', unit: 'm²' },
        { id: 'sheetLength', label: 'Sheet Length', placeholder: '2.4', unit: 'm' },
        { id: 'sheetWidth', label: 'Sheet Width', placeholder: '1.2', unit: 'm' },
      ],
      formula: (inputs) => {
        const sheetArea = inputs.sheetLength * inputs.sheetWidth;
        const sheetsNeeded = Math.ceil(inputs.totalArea / sheetArea);
        const wastage = Math.ceil(sheetsNeeded * 1.1); // 10% wastage
        return {
          sheets: sheetsNeeded,
          withWastage: wastage,
          coverage: sheetsNeeded * sheetArea,
        };
      },
      resultLabel: 'Sheet Requirements'
    },

    // Plumbing & Drainage
    {
      id: 'pipe-sizing',
      name: 'Pipe Sizing Calculator',
      description: 'Calculate optimal pipe diameter',
      category: 'plumbing',
      inputs: [
        { id: 'flowRate', label: 'Flow Rate', placeholder: '20', unit: 'L/min' },
        { id: 'velocity', label: 'Max Velocity', placeholder: '2', unit: 'm/s' },
      ],
      formula: (inputs) => {
        const flowRateM3s = inputs.flowRate / (1000 * 60);
        const area = flowRateM3s / inputs.velocity;
        const diameter = Math.sqrt(area / Math.PI) * 2 * 1000; // Convert to mm
        return Math.ceil(diameter);
      },
      unit: 'mm',
      resultLabel: 'Minimum Pipe Diameter'
    },
    {
      id: 'water-flow',
      name: 'Water Flow Rate Calculator',
      description: 'Calculate flow rate through pipes',
      category: 'plumbing',
      inputs: [
        { id: 'pipeDiameter', label: 'Pipe Diameter', placeholder: '100', unit: 'mm' },
        { id: 'velocity', label: 'Water Velocity', placeholder: '1.5', unit: 'm/s' },
      ],
      formula: (inputs) => {
        const radius = (inputs.pipeDiameter / 1000) / 2;
        const area = Math.PI * radius * radius;
        const flowRate = area * inputs.velocity * 1000 * 60; // L/min
        return flowRate;
      },
      unit: 'L/min',
      resultLabel: 'Flow Rate'
    },
    {
      id: 'slope-calculation',
      name: 'Slope Calculation',
      description: 'Calculate drainage slope and fall',
      category: 'plumbing',
      inputs: [
        { id: 'distance', label: 'Horizontal Distance', placeholder: '20', unit: 'm' },
        { id: 'grade', label: 'Grade/Slope', placeholder: '1', unit: '%' },
      ],
      formula: (inputs) => {
        const fall = inputs.distance * (inputs.grade / 100);
        const angle = Math.atan(inputs.grade / 100) * (180 / Math.PI);
        return {
          fall: fall,
          angle: angle,
        };
      },
      resultLabel: 'Slope Calculations'
    },
    {
      id: 'trench-volume',
      name: 'Trench Depth & Backfill Volume',
      description: 'Calculate excavation and backfill requirements',
      category: 'plumbing',
      inputs: [
        { id: 'length', label: 'Trench Length', placeholder: '50', unit: 'm' },
        { id: 'width', label: 'Trench Width', placeholder: '0.6', unit: 'm' },
        { id: 'depth', label: 'Trench Depth', placeholder: '1.2', unit: 'm' },
      ],
      formula: (inputs) => {
        const volume = inputs.length * inputs.width * inputs.depth;
        const backfill = volume * 0.8; // Assuming 20% for pipe/bedding
        return {
          excavation: volume,
          backfill: backfill,
          spoil: volume - backfill,
        };
      },
      resultLabel: 'Trench Volumes'
    },

    // Electrical
    {
      id: 'cable-size',
      name: 'Cable Size Calculator',
      description: 'Calculate minimum cable size required',
      category: 'electrical',
      inputs: [
        { id: 'current', label: 'Load Current', placeholder: '20', unit: 'A' },
        { id: 'length', label: 'Cable Length', placeholder: '50', unit: 'm' },
        { id: 'voltage', label: 'Voltage', placeholder: '230', unit: 'V' },
      ],
      formula: (inputs) => {
        // Simplified cable sizing calculation
        const voltageDrop = inputs.current * inputs.length * 0.018; // Copper resistance
        const percentageDrop = (voltageDrop / inputs.voltage) * 100;
        let cableSize = 2.5;
        if (inputs.current > 20) cableSize = 4;
        if (inputs.current > 32) cableSize = 6;
        if (inputs.current > 40) cableSize = 10;
        return {
          cableSize: cableSize,
          voltageDrop: percentageDrop,
        };
      },
      resultLabel: 'Cable Requirements'
    },
    {
      id: 'voltage-drop',
      name: 'Voltage Drop Calculator',
      description: 'Calculate voltage drop in cables',
      category: 'electrical',
      inputs: [
        { id: 'current', label: 'Current', placeholder: '16', unit: 'A' },
        { id: 'length', label: 'Cable Length', placeholder: '30', unit: 'm' },
        { id: 'cableSize', label: 'Cable Size', placeholder: '2.5', unit: 'mm²' },
      ],
      formula: (inputs) => {
        const resistance = 0.018 / inputs.cableSize; // Ohms per meter
        const voltageDrop = inputs.current * inputs.length * resistance;
        const percentage = (voltageDrop / 230) * 100;
        return {
          voltageDrop: voltageDrop,
          percentage: percentage,
        };
      },
      resultLabel: 'Voltage Drop'
    },
    {
      id: 'breaker-size',
      name: 'Breaker Size Calculator',
      description: 'Calculate appropriate breaker size',
      category: 'electrical',
      inputs: [
        { id: 'loadCurrent', label: 'Load Current', placeholder: '18', unit: 'A' },
        { id: 'loadType', label: 'Load Type', placeholder: 'Motor', type: 'select', options: ['Resistive', 'Motor', 'Lighting'] },
      ],
      formula: (inputs) => {
        let multiplier = 1.25; // Standard safety factor
        if (inputs.loadType === 'Motor') multiplier = 1.5;
        if (inputs.loadType === 'Lighting') multiplier = 1.2;
        
        const requiredBreaker = inputs.loadCurrent * multiplier;
        const standardSizes = [6, 10, 16, 20, 25, 32, 40, 50, 63];
        const breakerSize = standardSizes.find(size => size >= requiredBreaker) || 63;
        
        return {
          calculated: requiredBreaker,
          recommended: breakerSize,
        };
      },
      resultLabel: 'Breaker Size'
    },
    {
      id: 'lighting-load',
      name: 'Lighting Load Calculator',
      description: 'Calculate lighting circuit requirements',
      category: 'electrical',
      inputs: [
        { id: 'roomArea', label: 'Room Area', placeholder: '25', unit: 'm²' },
        { id: 'lightingLevel', label: 'Lighting Level', placeholder: '300', unit: 'lux' },
        { id: 'fixtureWattage', label: 'Fixture Wattage', placeholder: '18', unit: 'W' },
      ],
      formula: (inputs) => {
        const lumensNeeded = inputs.roomArea * inputs.lightingLevel;
        const lumensPerWatt = 80; // LED efficiency
        const totalWattage = lumensNeeded / lumensPerWatt;
        const fixtures = Math.ceil(totalWattage / inputs.fixtureWattage);
        return {
          totalWattage: totalWattage,
          fixtures: fixtures,
          current: totalWattage / 230,
        };
      },
      resultLabel: 'Lighting Requirements'
    },

    // Roofing & Cladding
    {
      id: 'roofing-coverage',
      name: 'Roofing Sheets & Tiles Coverage',
      description: 'Calculate roofing material requirements',
      category: 'roofing',
      inputs: [
        { id: 'roofLength', label: 'Roof Length', placeholder: '12', unit: 'm' },
        { id: 'roofWidth', label: 'Roof Width', placeholder: '8', unit: 'm' },
        { id: 'sheetWidth', label: 'Sheet/Tile Width', placeholder: '0.76', unit: 'm' },
        { id: 'sheetLength', label: 'Sheet/Tile Length', placeholder: '3', unit: 'm' },
      ],
      formula: (inputs) => {
        const roofArea = inputs.roofLength * inputs.roofWidth;
        const sheetArea = inputs.sheetWidth * inputs.sheetLength;
        const sheetsNeeded = Math.ceil(roofArea / sheetArea);
        const wastage = Math.ceil(sheetsNeeded * 1.15); // 15% wastage
        return {
          area: roofArea,
          sheets: sheetsNeeded,
          withWastage: wastage,
        };
      },
      resultLabel: 'Roofing Materials'
    },
    {
      id: 'siding-area',
      name: 'Siding & Cladding Area Calculator',
      description: 'Calculate cladding material requirements',
      category: 'roofing',
      inputs: [
        { id: 'wallHeight', label: 'Wall Height', placeholder: '2.4', unit: 'm' },
        { id: 'wallLength', label: 'Wall Length', placeholder: '20', unit: 'm' },
        { id: 'windowArea', label: 'Windows/Doors Area', placeholder: '8', unit: 'm²' },
      ],
      formula: (inputs) => {
        const grossArea = inputs.wallHeight * inputs.wallLength;
        const netArea = grossArea - inputs.windowArea;
        const wastage = netArea * 1.1; // 10% wastage
        return {
          grossArea: grossArea,
          netArea: netArea,
          withWastage: wastage,
        };
      },
      resultLabel: 'Cladding Area'
    },
    {
      id: 'paint-coverage',
      name: 'Paint & Primer Coverage',
      description: 'Calculate paint and primer requirements',
      category: 'roofing',
      inputs: [
        { id: 'surfaceArea', label: 'Surface Area', placeholder: '150', unit: 'm²' },
        { id: 'coats', label: 'Number of Coats', placeholder: '2', unit: 'coats' },
        { id: 'coverage', label: 'Paint Coverage', placeholder: '12', unit: 'm²/L' },
      ],
      formula: (inputs) => {
        const totalArea = inputs.surfaceArea * inputs.coats;
        const litersNeeded = totalArea / inputs.coverage;
        const cans = Math.ceil(litersNeeded / 4); // 4L cans
        return {
          liters: litersNeeded,
          cans: cans,
        };
      },
      resultLabel: 'Paint Requirements'
    },

    // Insulation & Thermal
    {
      id: 'r-value',
      name: 'R-value/U-value Estimator',
      description: 'Calculate thermal resistance values',
      category: 'insulation',
      inputs: [
        { id: 'thickness', label: 'Insulation Thickness', placeholder: '90', unit: 'mm' },
        { id: 'material', label: 'Material Type', placeholder: 'Glasswool', type: 'select', options: ['Glasswool', 'Polyester', 'Foam', 'Bulk'] },
      ],
      formula: (inputs) => {
        let rValuePerMm = 0.037; // Glasswool default
        if (inputs.material === 'Polyester') rValuePerMm = 0.04;
        if (inputs.material === 'Foam') rValuePerMm = 0.05;
        if (inputs.material === 'Bulk') rValuePerMm = 0.025;
        
        const rValue = (inputs.thickness / 1000) / rValuePerMm;
        const uValue = 1 / rValue;
        return {
          rValue: rValue,
          uValue: uValue,
        };
      },
      resultLabel: 'Thermal Values'
    },
    {
      id: 'insulation-coverage',
      name: 'Insulation Material Coverage',
      description: 'Calculate insulation material requirements',
      category: 'insulation',
      inputs: [
        { id: 'wallArea', label: 'Wall Area', placeholder: '80', unit: 'm²' },
        { id: 'studSpacing', label: 'Stud Spacing', placeholder: '0.6', unit: 'm' },
        { id: 'studDepth', label: 'Stud Depth', placeholder: '90', unit: 'mm' },
      ],
      formula: (inputs) => {
        const battsPerM2 = 1 / inputs.studSpacing;
        const totalBatts = Math.ceil(inputs.wallArea * battsPerM2);
        const volume = inputs.wallArea * (inputs.studDepth / 1000);
        return {
          batts: totalBatts,
          volume: volume,
        };
      },
      resultLabel: 'Insulation Requirements'
    },

    // General Construction
    {
      id: 'material-cost',
      name: 'Material Cost Estimator',
      description: 'Estimate total material costs',
      category: 'general',
      inputs: [
        { id: 'quantity', label: 'Quantity', placeholder: '100', unit: 'units' },
        { id: 'unitCost', label: 'Unit Cost', placeholder: '25', unit: '$' },
        { id: 'wastage', label: 'Wastage %', placeholder: '10', unit: '%' },
      ],
      formula: (inputs) => {
        const baseCost = inputs.quantity * inputs.unitCost;
        const wastageAmount = baseCost * (inputs.wastage / 100);
        const totalCost = baseCost + wastageAmount;
        return {
          baseCost: baseCost,
          wastageAmount: wastageAmount,
          totalCost: totalCost,
        };
      },
      resultLabel: 'Cost Breakdown'
    },
    {
      id: 'labor-hours',
      name: 'Labor Hours Estimator',
      description: 'Estimate labor time requirements',
      category: 'general',
      inputs: [
        { id: 'area', label: 'Work Area', placeholder: '50', unit: 'm²' },
        { id: 'ratePerM2', label: 'Hours per m²', placeholder: '0.5', unit: 'hrs/m²' },
        { id: 'workers', label: 'Number of Workers', placeholder: '2', unit: 'people' },
      ],
      formula: (inputs) => {
        const totalHours = inputs.area * inputs.ratePerM2;
        const daysRequired = totalHours / (inputs.workers * 8); // 8 hour days
        const cost = totalHours * 45; // $45/hour average
        return {
          totalHours: totalHours,
          days: daysRequired,
          cost: cost,
        };
      },
      resultLabel: 'Labor Estimates'
    },
    {
      id: 'waste-calculator',
      name: 'Waste/Overage Calculator',
      description: 'Calculate material waste and overage',
      category: 'general',
      inputs: [
        { id: 'baseQuantity', label: 'Base Quantity', placeholder: '100', unit: 'units' },
        { id: 'wastePercent', label: 'Waste Percentage', placeholder: '15', unit: '%' },
        { id: 'complexity', label: 'Job Complexity', placeholder: 'Standard', type: 'select', options: ['Simple', 'Standard', 'Complex'] },
      ],
      formula: (inputs) => {
        let complexityMultiplier = 1;
        if (inputs.complexity === 'Complex') complexityMultiplier = 1.2;
        if (inputs.complexity === 'Simple') complexityMultiplier = 0.9;
        
        const adjustedWaste = inputs.wastePercent * complexityMultiplier;
        const wasteQuantity = inputs.baseQuantity * (adjustedWaste / 100);
        const totalQuantity = inputs.baseQuantity + wasteQuantity;
        
        return {
          waste: wasteQuantity,
          total: totalQuantity,
          adjustedWastePercent: adjustedWaste,
        };
      },
      resultLabel: 'Waste Calculations'
    },
    {
      id: 'project-timeline',
      name: 'Project Timeline Estimator',
      description: 'Estimate project duration and milestones',
      category: 'general',
      inputs: [
        { id: 'totalArea', label: 'Total Project Area', placeholder: '200', unit: 'm²' },
        { id: 'projectType', label: 'Project Type', placeholder: 'Residential', type: 'select', options: ['Residential', 'Commercial', 'Renovation'] },
        { id: 'workers', label: 'Team Size', placeholder: '4', unit: 'people' },
      ],
      formula: (inputs) => {
        let hoursPerM2 = 8; // Residential default
        if (inputs.projectType === 'Commercial') hoursPerM2 = 12;
        if (inputs.projectType === 'Renovation') hoursPerM2 = 15;
        
        const totalHours = inputs.totalArea * hoursPerM2;
        const workingDays = totalHours / (inputs.workers * 8);
        const calendarDays = workingDays * 1.4; // Account for weekends/delays
        
        return {
          totalHours: totalHours,
          workingDays: workingDays,
          calendarDays: calendarDays,
          weeks: calendarDays / 7,
        };
      },
      resultLabel: 'Timeline Estimates'
    },
  ];

  const getCalculatorsByCategory = (categoryId: string) => {
    return calculators.filter(calc => calc.category === categoryId);
  };

  const handleCalculate = () => {
    if (!selectedCalculator) return;

    try {
      const inputs: Record<string, number> = {};
      let hasAllInputs = true;

      selectedCalculator.inputs.forEach(input => {
        const value = calculatorInputs[input.id];
        if (!value || value.trim() === '') {
          hasAllInputs = false;
          return;
        }
        
        if (input.type === 'select') {
          inputs[input.id] = input.options?.indexOf(value) || 0;
        } else {
          inputs[input.id] = parseFloat(value);
        }
      });

      if (!hasAllInputs) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      const result = selectedCalculator.formula(inputs);
      setResults(result);
    } catch (error) {
      Alert.alert('Error', 'Invalid input values. Please check your entries.');
    }
  };

  const resetCalculator = () => {
    setCalculatorInputs({});
    setResults(null);
  };

  const formatResult = (value: number, precision: number = 2) => {
    return value.toFixed(precision);
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Construction Tools</Text>
          <Calculator color="#FFF" size={24} />
        </View>
        
        <Text style={styles.subtitle}>Professional calculators for NZ construction</Text>
        
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={styles.categoryCard}
              onPress={() => setSelectedCategory(category.id)}
            >
              <GlassCard variant="electric" style={styles.categoryCardInner}>
                <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                  {category.icon}
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
                <View style={styles.calculatorCount}>
                  <Text style={styles.countText}>
                    {getCalculatorsByCategory(category.id).length} tools
                  </Text>
                  <ChevronRight color="#94A3B8" size={16} />
                </View>
              </GlassCard>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Category Calculators Modal */}
      <Modal
        visible={selectedCategory !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedCategory(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {categories.find(c => c.id === selectedCategory)?.name}
              </Text>
              <Pressable onPress={() => setSelectedCategory(null)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.calculatorsList}>
              {selectedCategory && getCalculatorsByCategory(selectedCategory).map((calculator) => (
                <Pressable
                  key={calculator.id}
                  style={styles.calculatorItem}
                  onPress={() => {
                    setSelectedCalculator(calculator);
                    setSelectedCategory(null);
                    resetCalculator();
                  }}
                >
                  <View style={styles.calculatorInfo}>
                    <Text style={styles.calculatorName}>{calculator.name}</Text>
                    <Text style={styles.calculatorDescription}>{calculator.description}</Text>
                  </View>
                  <ChevronRight color="#94A3B8" size={20} />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Calculator Modal */}
      <Modal
        visible={selectedCalculator !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedCalculator(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedCalculator?.name}</Text>
              <Pressable onPress={() => setSelectedCalculator(null)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.calculatorForm}>
              <Text style={styles.calculatorDescription}>
                {selectedCalculator?.description}
              </Text>
              
              <View style={styles.inputsContainer}>
                {selectedCalculator?.inputs.map((input) => (
                  <View key={input.id} style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      {input.label} {input.unit && `(${input.unit})`}
                    </Text>
                    {input.type === 'select' ? (
                      <View style={styles.selectContainer}>
                        {input.options?.map((option) => (
                          <Pressable
                            key={option}
                            style={[
                              styles.selectOption,
                              calculatorInputs[input.id] === option && styles.selectedOption
                            ]}
                            onPress={() => setCalculatorInputs(prev => ({ ...prev, [input.id]: option }))}
                          >
                            <Text style={[
                              styles.selectOptionText,
                              calculatorInputs[input.id] === option && styles.selectedOptionText
                            ]}>
                              {option}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    ) : (
                      <TextInput
                        style={styles.calculatorInput}
                        value={calculatorInputs[input.id] || ''}
                        onChangeText={(text) => setCalculatorInputs(prev => ({ ...prev, [input.id]: text }))}
                        placeholder={input.placeholder}
                        placeholderTextColor="#64748B"
                        keyboardType="numeric"
                      />
                    )}
                  </View>
                ))}
              </View>
              
              <View style={styles.calculatorActions}>
                <Pressable style={styles.calculateButton} onPress={handleCalculate}>
                  <Calculator color="#FFF" size={20} />
                  <Text style={styles.calculateButtonText}>Calculate</Text>
                </Pressable>
                
                <Pressable style={styles.resetButton} onPress={resetCalculator}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </Pressable>
              </View>
              
              {results && (
                <GlassCard variant="electric" style={styles.resultsCard}>
                  <View style={styles.resultsHeader}>
                    <Text style={styles.resultsTitle}>{selectedCalculator?.resultLabel}</Text>
                    <Info color="#3B82F6" size={20} />
                  </View>
                  
                  <View style={styles.resultsContent}>
                    {typeof results === 'number' ? (
                      <View style={styles.resultItem}>
                        <Text style={styles.resultValue}>
                          {formatResult(results)} {selectedCalculator?.unit}
                        </Text>
                      </View>
                    ) : (
                      Object.entries(results).map(([key, value]) => (
                        <View key={key} style={styles.resultItem}>
                          <Text style={styles.resultLabel}>
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                          </Text>
                          <Text style={styles.resultValue}>
                            {typeof value === 'number' ? formatResult(value) : value}
                            {key.includes('Cost') || key.includes('cost') ? ' $' : ''}
                            {key.includes('Area') || key.includes('area') ? ' m²' : ''}
                            {key.includes('Length') || key.includes('length') ? ' m' : ''}
                            {key.includes('Volume') || key.includes('volume') ? ' m³' : ''}
                            {key.includes('Hours') || key.includes('hours') ? ' hrs' : ''}
                            {key.includes('Days') || key.includes('days') ? ' days' : ''}
                            {key.includes('Weeks') || key.includes('weeks') ? ' weeks' : ''}
                            {key.includes('Percentage') || key.includes('percentage') ? ' %' : ''}
                          </Text>
                        </View>
                      ))
                    )}
                  </View>
                </GlassCard>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 24,
  },
  categoriesGrid: {
    gap: 16,
  },
  categoryCard: {
    marginBottom: 8,
  },
  categoryCardInner: {
    marginVertical: 0,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  calculatorCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  countText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
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
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  calculatorsList: {
    maxHeight: 400,
  },
  calculatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  calculatorInfo: {
    flex: 1,
  },
  calculatorName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  calculatorDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 16,
  },
  calculatorForm: {
    flex: 1,
  },
  inputsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 8,
  },
  calculatorInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  selectOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  selectOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  selectedOptionText: {
    color: '#FFF',
  },
  calculatorActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  calculateButton: {
    flex: 2,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  calculateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  resetButton: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  resultsCard: {
    marginVertical: 0,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  resultsContent: {
    gap: 12,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    flex: 1,
  },
  resultValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
});