import type { BoreLogData } from '../components/BoreLogViewer/types';

/**
 * Sample bore log data for demonstration and testing.
 * Modelled on the ESlog BH01 GW (Groundwater Log) format.
 */
const sampleBoreLogData: BoreLogData = {
  reports: [
    {
      id: 1,
      name: 'BH01 GW - Groundwater Log',
      depthPerPage: 14,
      startDepth: 0,
      endDepth: 14,
      endDepthComment: 'Termination Depth at:14 m',
      fontSize: 8,
      headerRows: [
        {
          id: 1,
          showOnAllPages: true,
          height: '8',
          columns: [
            {
              id: 10,
              width: 20,
              halign: 'left',
              valign: 'middle',
              items: [
                { id: 100, label: 'ENVIROLABS', fontSize: 14 },
              ],
            },
            {
              id: 11,
              width: 60,
              halign: 'center',
              valign: 'middle',
              items: [
                { id: 101, label: 'GROUNDWATER BORE LOG', fontSize: 14 },
              ],
            },
            {
              id: 12,
              width: 20,
              halign: 'right',
              valign: 'middle',
              items: [
                { id: 102, label: 'BH01', fontSize: 14 },
              ],
            },
          ],
        },
        {
          id: 2,
          showOnAllPages: true,
          height: '9',
          columns: [
            {
              id: 20,
              width: 35,
              borderTop: true,
              borderLeft: true,
              items: [
                { id: 200, label: 'PROJECT NUMBER:', text: '92843' },
                { id: 201, label: 'CLIENT:', text: 'EPA Victoria' },
                { id: 202, label: 'SITE:', text: 'Former Service Station, 125 Main St' },
              ],
            },
            {
              id: 21,
              width: 30,
              borderTop: true,
              items: [
                { id: 210, label: 'DRILLER:', text: 'Geomech Drilling' },
                { id: 211, label: 'RIG TYPE:', text: 'Genfab DR5000' },
                { id: 212, label: 'METHOD:', text: 'HW Mud Rotary' },
              ],
            },
            {
              id: 22,
              width: 35,
              borderTop: true,
              borderRight: true,
              items: [
                { id: 220, label: 'DATE STARTED:', text: '22/07/2024' },
                { id: 221, label: 'DATE COMPLETED:', text: '23/07/2024' },
                { id: 222, label: 'SURFACE ELEVATION:', text: '45.15 m AHD' },
                { id: 223, label: 'TOTAL DEPTH:', text: '14' },
              ],
            },
          ],
        },
      ],
      columns: [
        // Depth axis
        {
          id: 1,
          text: 'Depth (m)',
          type: 'axis' as const,
          width: 4,
          yAxis: {
            autoCalculateTicks: true,
            valueType: 'depth' as const,
            majorTickFrequency: 1,
            minorTickFrequency: 0.5,
          },
        },
        // PID column
        {
          id: 2,
          text: 'PID',
          type: 'text' as const,
          width: 3,
          blocks: [
            { id: 2001, d1: 0.5, d2: 1, text: '0.8' },
            { id: 2002, d1: 1, d2: 2, text: '1.2' },
            { id: 2003, d1: 2, d2: 3, text: '5.4' },
            { id: 2004, d1: 3, d2: 4, text: '12.1' },
            { id: 2005, d1: 4, d2: 5, text: '8.6' },
            { id: 2006, d1: 5, d2: 6, text: '3.2' },
            { id: 2007, d1: 6, d2: 7, text: '2.1' },
            { id: 2008, d1: 7, d2: 8, text: '0.5' },
            { id: 2009, d1: 8, d2: 9, text: '0.3' },
          ],
        },
        // Samples column
        {
          id: 3,
          text: 'Samples',
          type: 'text' as const,
          width: 4,
          blocks: [
            { id: 3001, d1: 0.5, d2: 1, text: 'SS1' },
            { id: 3002, d1: 2.5, d2: 3, text: 'SS2' },
            { id: 3003, d1: 4.5, d2: 5, text: 'SS3' },
            { id: 3004, d1: 6.5, d2: 7, text: 'SS4' },
            { id: 3005, d1: 9, d2: 9.5, text: 'SS5' },
          ],
        },
        // Moisture column
        {
          id: 4,
          text: 'Moisture',
          type: 'text' as const,
          width: 3,
          blocks: [
            { id: 4001, d1: 0, d2: 2, text: 'D' },
            { id: 4002, d1: 2, d2: 5, text: 'M' },
            { id: 4003, d1: 5, d2: 14, text: 'W' },
          ],
        },
        // Graphic Log
        {
          id: 5,
          text: 'Graphic Log',
          type: 'graphic' as const,
          width: 5,
          blocks: [
            { id: 5001, d1: 0, d2: 0.2, graphicId: 'other-04', text: 'ASPHALT' },
            { id: 5002, d1: 0.2, d2: 3, graphicId: 'uscs-cl', topLineDashes: [5, 3] },
            { id: 5003, d1: 3, d2: 5, graphicId: 'uscs-sc', topLineDashes: [5, 3] },
            { id: 5004, d1: 5, d2: 8, graphicId: 'uscs-gp', topLineDashes: [5, 3] },
            { id: 5005, d1: 8, d2: 11, graphicId: 'uscs-sm', topLineDashes: [5, 3] },
            { id: 5006, d1: 11, d2: 14, graphicId: 'bgs-sltst', topLineDashes: [5, 3] },
          ],
        },
        // Material Description
        {
          id: 6,
          text: 'Material Description',
          type: 'text' as const,
          width: 25,
          showEndDepthComment: true,
          blocks: [
            {
              id: 6001,
              d1: 0,
              d2: 0.2,
              text: 'ASPHALT: Black, 200mm thick',
              depthRange: '0 - 0.2',
            },
            {
              id: 6002,
              d1: 0.2,
              d2: 3,
              text: 'CLAY (CL): Brown, dry to moist, stiff, with occasional rootlets in upper 0.5m. Becoming more plastic with depth.',
              depthRange: '0.2 - 3',
            },
            {
              id: 6003,
              d1: 3,
              d2: 5,
              text: 'CLAYEY SAND (SC): Orange-brown, moist, medium dense, fine to medium grained, minor gravel.',
              depthRange: '3 - 5',
            },
            {
              id: 6004,
              d1: 5,
              d2: 8,
              text: 'GRAVEL (GP): Grey, wet, dense, angular to sub-angular, coarse. Water strike at 5.3 m.',
              depthRange: '5 - 8',
            },
            {
              id: 6005,
              d1: 8,
              d2: 11,
              text: 'SILTY SAND (SM): Grey, wet, dense, fine to medium grained, trace clay.',
              depthRange: '8 - 11',
            },
            {
              id: 6006,
              d1: 11,
              d2: 14,
              text: 'SILTSTONE: Grey, highly weathered, low strength, extremely weathered near surface becoming moderately weathered.',
              depthRange: '11 - 14',
            },
          ],
          waterStrikes: [
            { id: 9001, depth: 5.3, recovery: 4.8 },
          ],
        },
        // Well Installation - Graphic column with well construction
        {
          id: 7,
          text: 'Well Installation',
          type: 'graphic' as const,
          width: 8,
          showAnnotation: true,
          enableWellsEdit: true,
          wells: [
            {
              id: 701,
              name: 'A',
              topCasing: 0,
              bottomCasing: 8,
              topScreen: 5,
              bottomScreen: 13.5,
              bottomCap: 14,
            },
          ],
          blocks: [
            { id: 7001, d1: 0, d2: 1.5, graphicId: 'bkfl-42', text: 'Grout' },
            { id: 7002, d1: 1.5, d2: 4, graphicId: 'bkfl-22', text: 'Bentonite' },
            { id: 7003, d1: 4, d2: 14, graphicId: 'bkfl-31', text: 'Sand Pack' },
          ],
        },
        // Elevation axis
        {
          id: 8,
          text: 'Elevation (m)',
          type: 'axis' as const,
          width: 4,
          yAxis: {
            autoCalculateTicks: true,
            valueType: 'scaleExpression' as const,
            scaleExpression: '45.15 - d',
            majorTickFrequency: 1,
            minorTickFrequency: 0.5,
          },
        },
      ],
      footerRows: [
        {
          id: 301,
          showOnAllPages: true,
          height: 4,
          columns: [
            {
              id: 310,
              width: 75,
              halign: 'left',
              items: [
                {
                  id: 3100,
                  text: 'This document shall not be reproduced except in full.',
                },
              ],
            },
            {
              id: 311,
              halign: 'right',
              items: [
                {
                  id: 3110,
                  text: 'Page <%= pageNumber %> of <%= totalPages %>',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'TP04 - Test Pit Log',
      depthPerPage: 6,
      startDepth: 0,
      endDepth: 6,
      endDepthComment: 'Termination Depth at:6 m',
      fontSize: 8,
      headerRows: [
        {
          id: 50,
          showOnAllPages: true,
          height: '8',
          columns: [
            {
              id: 500,
              halign: 'center',
              valign: 'middle',
              items: [
                { id: 5000, label: 'TEST PIT LOG — TP04', fontSize: 14 },
              ],
            },
          ],
        },
        {
          id: 51,
          height: '9',
          columns: [
            {
              id: 510,
              width: 50,
              borderTop: true,
              borderLeft: true,
              items: [
                { id: 5100, label: 'PROJECT:', text: '92843' },
                { id: 5101, label: 'SITE:', text: 'Former Service Station' },
              ],
            },
            {
              id: 511,
              width: 50,
              borderTop: true,
              borderRight: true,
              items: [
                { id: 5110, label: 'DATE:', text: '24/07/2024' },
                { id: 5111, label: 'EXCAVATOR:', text: '5T Excavator' },
              ],
            },
          ],
        },
      ],
      columns: [
        {
          id: 60,
          text: 'Depth (m)',
          type: 'axis' as const,
          width: 5,
          yAxis: {
            autoCalculateTicks: true,
            valueType: 'depth' as const,
            majorTickFrequency: 1,
            minorTickFrequency: 0.5,
          },
        },
        {
          id: 61,
          text: 'Samples',
          type: 'text' as const,
          width: 5,
          blocks: [
            { id: 6100, d1: 0.5, d2: 1, text: 'TP04-S1' },
            { id: 6101, d1: 2, d2: 2.5, text: 'TP04-S2' },
            { id: 6102, d1: 4, d2: 4.5, text: 'TP04-S3' },
          ],
        },
        {
          id: 62,
          text: 'Graphic Log',
          type: 'graphic' as const,
          width: 6,
          blocks: [
            { id: 6200, d1: 0, d2: 1.5, graphicId: 'uscs-cl' },
            { id: 6201, d1: 1.5, d2: 3.5, graphicId: 'uscs-sc', topLineDashes: [5, 3] },
            { id: 6202, d1: 3.5, d2: 6, graphicId: 'uscs-gp', topLineDashes: [5, 3] },
          ],
        },
        {
          id: 63,
          text: 'Material Description',
          type: 'text' as const,
          width: 30,
          showEndDepthComment: true,
          blocks: [
            {
              id: 6300,
              d1: 0,
              d2: 1.5,
              text: 'CLAY (CL): Brown, dry, stiff, with rootlets',
            },
            {
              id: 6301,
              d1: 1.5,
              d2: 3.5,
              text: 'CLAYEY SAND (SC): Orange-brown, moist, medium dense',
            },
            {
              id: 6302,
              d1: 3.5,
              d2: 6,
              text: 'GRAVEL (GP): Grey, wet, dense, angular',
            },
          ],
        },
      ],
      footerRows: [
        {
          id: 600,
          showOnAllPages: true,
          height: 4,
          columns: [
            {
              id: 6000,
              items: [
                {
                  id: 60000,
                  text: 'Page <%= pageNumber %> of <%= totalPages %>',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  images: [],
};

export default sampleBoreLogData;
