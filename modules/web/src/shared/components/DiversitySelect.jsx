import { useState } from 'react';

const GRUPOS_DIVERSIDADE = [
  { value: 'PCD', label: 'Pessoas com Deficiência (PCD)' },
  { value: 'RACIAL', label: 'Pessoas Negras e Indígenas' },
  { value: 'GENERO', label: 'Mulheres e Pessoas Não-Binárias' },
  { value: 'LGBTQIA', label: 'LGBTQIA+' },
  { value: '50MAIS', label: 'Pessoas 50+' },
  { value: 'REFUGIADOS', label: 'Refugiados e Imigrantes' },
  { value: 'PERIFERIA', label: 'Pessoas de Periferias' },
  { value: 'NEURODIVERSO', label: 'Pessoas Neurodivergentes' },
];

export function DiversitySelect({ value = [], onChange }) {
  const [open, setOpen] = useState(false);

  const toggle = (grupo) => {
    const updated = value.includes(grupo)
      ? value.filter(g => g !== grupo)
      : [...value, grupo];
    onChange(updated);
  };

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full border rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-primary bg-white">
        {value.length > 0
          ? value.map(v => GRUPOS_DIVERSIDADE.find(g => g.value === v)?.label || v).join(', ')
          : 'Selecione os grupos...'}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {GRUPOS_DIVERSIDADE.map(grupo => (
            <label key={grupo.value}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm">
              <input type="checkbox" checked={value.includes(grupo.value)}
                onChange={() => toggle(grupo.value)} className="rounded" />
              {grupo.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
