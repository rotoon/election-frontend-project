export const MOCK_CONSTITUENCY_COUNT: Record<string, number> = {
  กรุงเทพมหานคร: 33,
  นนทบุรี: 8,
  ปทุมธานี: 7,
  สมุทรปราการ: 8,
  นครปฐม: 6,
  เชียงใหม่: 10,
  เชียงราย: 7,
  ลำปาง: 5,
  นครราชสีมา: 16,
  ขอนแก่น: 11,
  อุดรธานี: 10,
  อุบลราชธานี: 11,
  ชลบุรี: 10,
  ระยอง: 4,
  สงขลา: 9,
  สุราษฎร์ธานี: 6,
  นครศรีธรรมราช: 9,
}

export function getMockConstituencyCount(provinceName: string): number {
  return (
    MOCK_CONSTITUENCY_COUNT[provinceName] ?? Math.floor(Math.random() * 5) + 1
  )
}
