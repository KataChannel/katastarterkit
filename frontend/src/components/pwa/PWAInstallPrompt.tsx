'use client';

import React, { useState, useEffect } from 'react';
import { usePWA } from '../../hooks/usePWA';
import { useSiteName } from '@/hooks/useSiteName';
import { useWebsiteSettingsMap } from '@/hooks/useWebsiteSettings';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Smartphone, Zap, Bell, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PWAInstallPromptProps {
  className?: string;
  showDelay?: number;
  position?: 'top' | 'bottom' | 'center';
}

export function PWAInstallPrompt({ 
  className = '', 
  showDelay = 5000,
  position = 'bottom' 
}: PWAInstallPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);
  const { siteName } = useSiteName();
  const { settings } = useWebsiteSettingsMap();
  
  // Get settings with fallbacks
  const logo = settings['header.logo'] || '/icons/icon-192x192.png';
  const primaryColor = settings['appearance.primary_color'] || '#2563eb';
  const tagline = settings['site.tagline'] || 'Trải nghiệm tốt hơn với ứng dụng';
  
  const { 
    capabilities, 
    installPrompt, 
    install,
    showNotification
  } = usePWA();

  // Check if we should show the install prompt
  useEffect(() => {
    if (!capabilities.canInstall || capabilities.isStandalone || dismissed) {
      return;
    }

    // Check if user has dismissed recently
    const lastDismissed = localStorage.getItem('pwa-install-dismissed');
    if (lastDismissed) {
      const dismissedTime = parseInt(lastDismissed);
      const minDelay = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      if (Date.now() - dismissedTime < minDelay) {
        return;
      }
    }

    // Show prompt after delay
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, showDelay);

    return () => clearTimeout(timer);
  }, [capabilities.canInstall, capabilities.isStandalone, dismissed, showDelay]);

  // Handle install
  const handleInstall = async () => {
    if (!installPrompt) return;

    setInstalling(true);
    try {
      await install();
      setShowPrompt(false);
      
      // Show success notification
      if (capabilities.hasNotificationSupport) {
        await showNotification('Cài đặt thành công!', {
          body: `${siteName} đã được cài đặt. Bạn có thể truy cập từ màn hình chính.`,
          tag: 'pwa-install-success'
        });
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setInstalling(false);
    }
  };

  // Handle dismiss
  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Handle "Maybe Later"
  const handleMaybeLater = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    
    // Show again after 3 days
    setTimeout(() => {
      setDismissed(false);
    }, 3 * 24 * 60 * 60 * 1000);
  };

  if (!capabilities.canInstall || capabilities.isStandalone) {
    return null;
  }

  // Features list with Vietnamese text
  const features = [
    { icon: Zap, text: 'Tải nhanh hơn', color: 'text-yellow-500' },
    { icon: Smartphone, text: 'Hoạt động offline', color: 'text-blue-500' },
    { icon: Bell, text: 'Nhận thông báo', color: 'text-green-500' },
  ];

  return (
    <Dialog open={showPrompt} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {/* Header - Fixed with brand color */}
        <DialogHeader 
          className="p-6 pb-4 text-white relative overflow-hidden"
          style={{ backgroundColor: primaryColor }}
        >
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute w-32 h-32 bg-white rounded-full -top-10 -right-10" />
            <div className="absolute w-24 h-24 bg-white rounded-full -bottom-5 -left-5" />
          </div>
          
          <div className="relative z-10 flex items-center gap-4">
            {/* App Icon */}
            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
              {logo ? (
                <Image
                  src={logo}
                  alt={siteName}
                  width={56}
                  height={56}
                  className="object-contain"
                />
              ) : (
                <Download className="w-8 h-8" style={{ color: primaryColor }} />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold text-white truncate">
                {siteName}
              </DialogTitle>
              <DialogDescription className="text-white/80 text-sm mt-1">
                {tagline}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="text-muted-foreground text-sm">
            Cài đặt ứng dụng để có trải nghiệm tốt nhất:
          </p>
          
          {/* Features Grid */}
          <div className="grid gap-3">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
              >
                <div className={`p-2 rounded-lg bg-background ${feature.color}`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">{feature.text}</span>
                <Check className="w-4 h-4 text-green-500 ml-auto" />
              </motion.div>
            ))}
          </div>
          
          {/* Additional info */}
          <p className="text-xs text-muted-foreground text-center">
            Không chiếm nhiều dung lượng • Luôn cập nhật mới nhất
          </p>
        </div>

        {/* Footer - Fixed */}
        <DialogFooter className="p-6 pt-4 border-t bg-muted/30 flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleInstall}
            disabled={installing}
            className="w-full h-12 text-base font-semibold"
            style={{ backgroundColor: primaryColor }}
          >
            {installing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang cài đặt...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Cài đặt ứng dụng
              </>
            )}
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleMaybeLater}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Để sau
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Mini install button for header/toolbar
export function PWAInstallButton({ 
  variant = 'default',
  size = 'medium',
  className = '' 
}: {
  variant?: 'default' | 'minimal' | 'icon';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}) {
  const [installing, setInstalling] = useState(false);
  const { capabilities, install } = usePWA();
  const { settings } = useWebsiteSettingsMap();
  
  const primaryColor = settings['appearance.primary_color'] || '#2563eb';

  const handleInstall = async () => {
    setInstalling(true);
    try {
      await install();
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setInstalling(false);
    }
  };

  if (!capabilities.canInstall || capabilities.isStandalone) {
    return null;
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleInstall}
        disabled={installing}
        className={className}
        title="Cài đặt ứng dụng"
      >
        {installing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Download className="w-5 h-5" />
        )}
      </Button>
    );
  }

  const sizeClasses = {
    small: 'h-8 px-3 text-sm',
    medium: 'h-10 px-4 text-sm',
    large: 'h-12 px-6 text-base'
  };

  return (
    <Button
      variant={variant === 'minimal' ? 'outline' : 'default'}
      onClick={handleInstall}
      disabled={installing}
      className={`${sizeClasses[size]} ${className}`}
      style={variant === 'default' ? { backgroundColor: primaryColor } : undefined}
    >
      {installing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Đang cài đặt...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Cài đặt
        </>
      )}
    </Button>
  );
}