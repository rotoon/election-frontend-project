/**
 * Thailand Region to Province Mapping
 * All 77 provinces mapped to 6 regions + Bangkok
 *
 * NOTE: Province name strings MUST match exactly what backend API returns
 * in PublicConstituency.province field
 */

export const REGION_NAMES = [
  'ทั่วประเทศ',
  'กลาง',
  'ตะวันออก',
  'เหนือ',
  'อีสาน',
  'ใต้',
] as const

export type RegionName = (typeof REGION_NAMES)[number]

/**
 * Mapping of region name to array of province names
 * 'ทั่วประเทศ' is a sentinel value (not in mapping) - shows all provinces
 */
export const REGION_PROVINCES: Record<
  Exclude<RegionName, 'ทั่วประเทศ'>,
  string[]
> = {
  กลาง: [
    'กรุงเทพมหานคร',
    'กำแพงเพชร',
    'ชัยนาท',
    'นครนายก',
    'นครปฐม',
    'นครสวรรค์',
    'นนทบุรี',
    'ปทุมธานี',
    'พระนครศรีอยุธยา',
    'พิจิตร',
    'พิษณุโลก',
    'เพชรบูรณ์',
    'ลพบุรี',
    'สมุทรปราการ',
    'สมุทรสงคราม',
    'สมุทรสาคร',
    'สระบุรี',
    'สิงห์บุรี',
    'สุโขทัย',
    'สุพรรณบุรี',
    'อ่างทอง',
    'อุทัยธานี',
  ],

  ตะวันออก: [
    'จันทบุรี',
    'ฉะเชิงเทรา',
    'ชลบุรี',
    'ตราด',
    'ปราจีนบุรี',
    'ระยอง',
    'สระแก้ว',
  ],

  เหนือ: [
    'เชียงราย',
    'เชียงใหม่',
    'น่าน',
    'พะเยา',
    'แพร่',
    'แม่ฮ่องสอน',
    'ลำปาง',
    'ลำพูน',
    'อุตรดิตถ์',
  ],

  อีสาน: [
    'กาฬสินธุ์',
    'ขอนแก่น',
    'ชัยภูมิ',
    'นครพนม',
    'นครราชสีมา',
    'บึงกาฬ',
    'บุรีรัมย์',
    'มหาสารคาม',
    'มุกดาหาร',
    'ยโสธร',
    'ร้อยเอ็ด',
    'เลย',
    'ศรีสะเกษ',
    'สกลนคร',
    'สุรินทร์',
    'หนองคาย',
    'หนองบัวลำภู',
    'อำนาจเจริญ',
    'อุดรธานี',
    'อุบลราชธานี',
  ],

  ใต้: [
    'กระบี่',
    'ชุมพร',
    'ตรัง',
    'นครศรีธรรมราช',
    'นราธิวาส',
    'ปัตตานี',
    'พังงา',
    'พัทลุง',
    'ภูเก็ต',
    'ยะลา',
    'ระนอง',
    'สงขลา',
    'สตูล',
    'สุราษฎร์ธานี',
  ],
}

/**
 * Reverse lookup: get region for a given province
 * @param province - Province name (must match API data exactly)
 * @returns Region name or undefined if not found
 */
export function getRegionForProvince(
  province: string,
): RegionName | undefined {
  for (const [region, provinces] of Object.entries(REGION_PROVINCES)) {
    if (provinces.includes(province)) {
      return region as RegionName
    }
  }
  return undefined
}

/**
 * Get all provinces as a flat array
 * Useful for validation
 */
export function getAllProvinces(): string[] {
  return Object.values(REGION_PROVINCES).flat()
}
