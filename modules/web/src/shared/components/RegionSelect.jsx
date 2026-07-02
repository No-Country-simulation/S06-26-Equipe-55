import { useState, useRef, useEffect } from 'react';

const ESTADOS = [
  { value: 'BRASIL', label: 'Todo o Brasil' },
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

export function RegionSelect({ value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = (estado) => {
    if (estado === 'BRASIL') {
      onChange(value.includes('BRASIL') ? [] : ['BRASIL']);
      return;
    }
    const withoutBrasil = value.filter(v => v !== 'BRASIL');
    const updated = withoutBrasil.includes(estado)
      ? withoutBrasil.filter(v => v !== estado)
      : [...withoutBrasil, estado];
    onChange(updated);
  };

  const displayText = () => {
    if (value.includes('BRASIL')) return 'Todo o Brasil';
    if (value.length === 0) return 'Selecione as regiões...';
    if (value.length <= 3) return value.join(', ');
    return `${value.slice(0, 3).join(', ')} +${value.length - 3}`;
  };

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full border rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer">
        {displayText()}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {ESTADOS.map(estado => (
            <label key={estado.value}
              className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm ${estado.value === 'BRASIL' ? 'font-semibold border-b' : ''}`}>
              <input type="checkbox" checked={value.includes(estado.value)}
                onChange={() => toggle(estado.value)} className="rounded" />
              {estado.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
