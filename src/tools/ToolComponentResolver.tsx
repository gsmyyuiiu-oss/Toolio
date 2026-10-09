import React from 'react';
import { ToolDefinition } from '../types';

// Category Master Engines
import { ImageMasterTool } from './image/ImageMasterTool';
import { VideoMasterTool } from './video/VideoMasterTool';
import { AudioMasterTool } from './audio/AudioMasterTool';
import { GifMasterTool } from './gif/GifMasterTool';
import { PdfMasterTool } from './pdf/PdfMasterTool';
import { DocumentMasterTool } from './document/DocumentMasterTool';
import { FileMasterTool } from './files/FileMasterTool';
import { UnitMasterTool } from './converters/UnitMasterTool';
import { CalculatorsMasterTool } from './calculators/CalculatorsMasterTool';
import { DateTimeMasterTool } from './datetime/DateTimeMasterTool';
import { DeveloperMasterTool } from './developer/DeveloperMasterTool';
import { SeoMasterTool } from './seo/SeoMasterTool';
import { ColorMasterTool } from './color/ColorMasterTool';
import { SecurityMasterTool } from './security/SecurityMasterTool';
import { EducationMasterTool } from './education/EducationMasterTool';
import { BusinessMasterTool } from './business/BusinessMasterTool';

// Dedicated Priority 4 Tools
import { FreelanceRateCalculator } from './business/FreelanceRateCalculator';
import { MarketplaceFeeCalculator } from './business/MarketplaceFeeCalculator';
import { SignificantFiguresCalculator } from './education/SignificantFiguresCalculator';
import { SystemOfEquationsSolver } from './education/SystemOfEquationsSolver';
import { WebsiteToAndroidAppConverter } from './developer/WebsiteToAndroidAppConverter';

interface Props {
  tool: ToolDefinition;
}

export const ToolComponentResolver: React.FC<Props> = ({ tool }) => {
  // Direct matching for dedicated tools
  if (
    tool.slug === 'website-to-android-app-converter' ||
    tool.slug === 'website-to-android-converter' ||
    tool.componentId === 'website-to-android-app-converter'
  ) {
    return <WebsiteToAndroidAppConverter tool={tool} />;
  }
  if (tool.slug === 'freelance-rate-calculator') {
    return <FreelanceRateCalculator tool={tool} />;
  }
  if (tool.slug === 'marketplace-fee-calculator') {
    return <MarketplaceFeeCalculator tool={tool} />;
  }
  if (tool.slug === 'significant-figures-calculator' || tool.slug === 'significant-figures') {
    return <SignificantFiguresCalculator tool={tool} />;
  }
  if (tool.slug === 'system-of-equations-solver' || tool.slug === 'system-of-equations') {
    return <SystemOfEquationsSolver tool={tool} />;
  }

  // Category Master Engines
  switch (tool.category) {
    case 'image-tools':
      return <ImageMasterTool tool={tool} />;
    case 'video-tools':
      return <VideoMasterTool tool={tool} />;
    case 'audio-tools':
      return <AudioMasterTool tool={tool} />;
    case 'gif-tools':
      return <GifMasterTool tool={tool} />;
    case 'pdf-tools':
      return <PdfMasterTool tool={tool} />;
    case 'document-tools':
      return <DocumentMasterTool tool={tool} />;
    case 'file-tools':
      return <FileMasterTool tool={tool} />;
    case 'unit-converters':
      return <UnitMasterTool tool={tool} />;
    case 'calculators':
      return <CalculatorsMasterTool tool={tool} />;
    case 'date-time-tools':
      return <DateTimeMasterTool tool={tool} />;
    case 'developer-tools':
      return <DeveloperMasterTool tool={tool} />;
    case 'seo-tools':
      return <SeoMasterTool tool={tool} />;
    case 'color-tools':
      return <ColorMasterTool tool={tool} />;
    case 'security-tools':
    case 'security-generators':
      return <SecurityMasterTool tool={tool} />;
    case 'education-tools':
      return <EducationMasterTool tool={tool} />;
    case 'business-tools':
    case 'social-media-tools':
      return <BusinessMasterTool tool={tool} />;
    default:
      return <CalculatorsMasterTool tool={tool} />;
  }
};
