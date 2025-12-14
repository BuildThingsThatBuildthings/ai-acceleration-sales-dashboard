'use client';

import { useState, useCallback } from 'react';
import MobileHeader from './MobileHeader';
import MobileDrawer from './MobileDrawer';

interface MobileNavProps {
  followUpCount?: number;
}

export default function MobileNav({ followUpCount = 0 }: MobileNavProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  return (
    <>
      <MobileHeader onMenuClick={openDrawer} />
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        followUpCount={followUpCount}
      />
    </>
  );
}
