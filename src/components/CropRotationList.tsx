import React from 'react'

const CropRotationList: React.FC = () => (
  <div className="text-sm text-gray-700">
    <h3 className="text-lg font-semibold mb-2">🔄 Севооборот</h3>
    <ul className="list-disc list-inside space-y-1">
      <li>2021: Картофель → Морковь</li>
      <li>2022: Морковь → Томат</li>
      <li>2023: Томат → Горох</li>
    </ul>
  </div>
)

export default CropRotationList
