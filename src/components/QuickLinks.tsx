import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal, MoreHorizontal, Plus } from 'lucide-react';
import { MAX_QUICK_LINKS } from '../data/catalog';
import type { QuickLink } from '../types';
import { BrandIcon } from './BrandIcon';
import { useI18n } from '../i18n';

interface QuickLinkTileProps {
  link: QuickLink;
  onOpen?: (link: QuickLink) => void;
  onEdit?: (link: QuickLink) => void;
  dragHandle?: React.ReactNode;
}

function QuickLinkTile({ link, onOpen, onEdit, dragHandle }: QuickLinkTileProps) {
  const { t } = useI18n();
  return (
    <div className="quick-link">
      <button
        type="button"
        className="quick-link-main"
        aria-label={t('quick.open', { name: link.name })}
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
          aria-label={t('quick.edit', { name: link.name })}
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
  onKeyboardMove: (direction: -1 | 1) => void;
}

function SortableQuickLink({ link, onOpen, onEdit, onKeyboardMove }: SortableQuickLinkProps) {
  const { t } = useI18n();
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });

  return (
    <div
      ref={setNodeRef}
      className="quick-link-sortable"
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
            ref={setActivatorNodeRef}
            className="quick-link-drag"
            aria-label={t('quick.reorder', { name: link.name })}
            {...attributes}
            {...listeners}
            aria-keyshortcuts="ArrowLeft ArrowRight"
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                onKeyboardMove(-1);
              }
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                onKeyboardMove(1);
              }
            }}
          >
            <GripHorizontal aria-hidden="true" size={12} />
          </button>
        )}
      />
    </div>
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
  const { t } = useI18n();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 7 } }));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = links.findIndex((link) => link.id === active.id);
    const newIndex = links.findIndex((link) => link.id === over.id);
    if (oldIndex >= 0 && newIndex >= 0) onReorder(arrayMove(links, oldIndex, newIndex));
  };

  const moveByKeyboard = (link: QuickLink, direction: -1 | 1) => {
    const oldIndex = links.findIndex((item) => item.id === link.id);
    const newIndex = oldIndex + direction;
    if (oldIndex < 0 || newIndex < 0 || newIndex >= links.length) return;
    onReorder(arrayMove(links, oldIndex, newIndex));
  };

  return (
    <section className="quick-links-section" aria-labelledby="quick-links-title">
      <div className="section-kicker" id="quick-links-title">{t('section.quickLinks')}</div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="quick-links-dock">
          <SortableContext items={links.map((link) => link.id)} strategy={horizontalListSortingStrategy}>
            {links.map((link) => <SortableQuickLink key={link.id} link={link} onOpen={onOpen} onEdit={onEdit} onKeyboardMove={(direction) => moveByKeyboard(link, direction)} />)}
          </SortableContext>
          {links.length < MAX_QUICK_LINKS && (
            <div className="quick-link add-link">
              <button type="button" className="quick-link-main" onClick={onAdd} aria-label={t('quick.addLabel')}>
                <span className="quick-link-icon"><Plus aria-hidden="true" size={21} strokeWidth={1.6} /></span>
                <span className="quick-link-name">{t('quick.add')}</span>
              </button>
            </div>
          )}
        </div>
      </DndContext>
    </section>
  );
}
