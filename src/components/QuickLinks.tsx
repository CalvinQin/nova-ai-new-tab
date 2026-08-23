import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripHorizontal, MoreHorizontal, Plus } from 'lucide-react';
import { MAX_QUICK_LINKS } from '../data/catalog';
import type { QuickLink } from '../types';
import { BrandIcon } from './BrandIcon';

interface QuickLinkTileProps {
  link: QuickLink;
  lifted?: boolean;
  onOpen?: (link: QuickLink) => void;
  onEdit?: (link: QuickLink) => void;
  dragHandle?: React.ReactNode;
}

function QuickLinkTile({ link, lifted, onOpen, onEdit, dragHandle }: QuickLinkTileProps) {
  return (
    <div className={lifted ? 'quick-link is-lifted' : 'quick-link'}>
      <button
        type="button"
        className="quick-link-main"
        aria-label={`Open ${link.name}`}
        onClick={() => onOpen?.(link)}
      >
        <span
          className="quick-link-icon"
          style={{ '--brand': link.brandColor ?? 'currentColor' } as React.CSSProperties}
        >
          <BrandIcon icon={link.icon} iconUrl={link.iconUrl} label={link.name} size={22} />
        </span>
        <span className="quick-link-name">{link.name}</span>
      </button>
      {onEdit && (
        <button
          type="button"
          className="quick-link-edit"
          aria-label={`Edit ${link.name}`}
          onClick={(event) => {
            event.stopPropagation();
            onEdit(link);
          }}
        >
          <MoreHorizontal aria-hidden="true" size={14} />
        </button>
      )}
      {dragHandle}
      <span className="quick-link-tooltip" role="tooltip">{link.name}</span>
    </div>
  );
}

interface SortableQuickLinkProps extends QuickLinkTileProps {
  link: QuickLink;
}

function SortableQuickLink({ link, onOpen, onEdit }: SortableQuickLinkProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });

  return (
    <motion.div
      ref={setNodeRef}
      className="quick-link-sortable"
      layout
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.2 : 1,
      }}
    >
      <QuickLinkTile
        link={link}
        onOpen={onOpen}
        onEdit={onEdit}
        dragHandle={(
          <button
            type="button"
            className="quick-link-drag"
            aria-label={`Reorder ${link.name}`}
            {...attributes}
            {...listeners}
          >
            <GripHorizontal aria-hidden="true" size={12} />
          </button>
        )}
      />
    </motion.div>
  );
}

interface QuickLinksProps {
  links: QuickLink[];
  onReorder: (links: QuickLink[]) => void;
  onOpen: (link: QuickLink) => void;
  onEdit: (link: QuickLink) => void;
  onAdd: () => void;
}

export function QuickLinks({ links, onReorder, onOpen, onEdit, onAdd }: QuickLinksProps) {
  const [activeLink, setActiveLink] = useState<QuickLink | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 7 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveLink(links.find((link) => link.id === active.id) ?? null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveLink(null);
    if (!over || active.id === over.id) return;
    const oldIndex = links.findIndex((link) => link.id === active.id);
    const newIndex = links.findIndex((link) => link.id === over.id);
    if (oldIndex >= 0 && newIndex >= 0) onReorder(arrayMove(links, oldIndex, newIndex));
  };

  return (
    <section className="quick-links-section" aria-labelledby="quick-links-title">
      <div className="section-kicker" id="quick-links-title">Quick links</div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragCancel={() => setActiveLink(null)}
        onDragEnd={handleDragEnd}
      >
        <div className="quick-links-dock">
          <SortableContext items={links.map((link) => link.id)} strategy={rectSortingStrategy}>
            {links.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.34, delay: Math.min(index, 7) * 0.035, ease: [0.16, 1, 0.3, 1] }}
              >
                <SortableQuickLink link={link} onOpen={onOpen} onEdit={onEdit} />
              </motion.div>
            ))}
          </SortableContext>
          {links.length < MAX_QUICK_LINKS && (
            <div className="quick-link add-link">
              <button type="button" className="quick-link-main" onClick={onAdd} aria-label="Add quick link">
                <span className="quick-link-icon"><Plus aria-hidden="true" size={21} strokeWidth={1.6} /></span>
                <span className="quick-link-name">Add</span>
              </button>
            </div>
          )}
        </div>
        <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
          {activeLink ? <QuickLinkTile link={activeLink} lifted /> : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
}
