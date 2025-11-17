export const POSITION_DEFS = {
    'Flanking':    { colorClass: 'green', modifier: '+1d6 when Firing' },
    'Engaged':     { colorClass: 'yellow', modifier: '' },
    'Limited':     { colorClass: 'red', modifier: '-1d6 when Firing' },
    'Fortified':   { colorClass: 'green', modifier: 'Injury on 1' },
    'In Cover':    { colorClass: 'yellow', modifier: 'Injury on 1-2' },
    'Flanked':     { colorClass: 'red', modifier: 'Injury on 1-3' },
};

export const DEFAULT_TROOPER_TEMPLATE = {
    name: "New Trooper",
    status: "OK",
    gear: "assault_rifle, medium_armor",
    gritCurrent: 1,
    gritMax: 1,
    notes: "",
    isActive: true,
};
