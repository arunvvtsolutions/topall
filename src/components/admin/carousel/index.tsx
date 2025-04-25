'use client';
import AdminSectionHeader from '@/components/common/admin-header';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import CarouselCard from './carousel-card';
import {
  DndContext,
  useSensors,
  useSensor,
  DragOverlay,
  type DragStartEvent,
  closestCenter,
  MouseSensor,
  TouchSensor,
  type DragEndEvent
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { Icon } from '@/components/ui/icon';
import SelectDropdown from '@/components/common/Select';
import type { GenericType } from '@/types';
import { FormType, TosterMessages } from '@/types/enum';
import CarouselForm from './carousel-form';
import DeleteConfirmationModal from '@/components/delete-confirmation-dialog';
import { profile } from '@/utils/mock-password';
import PasswordConfirmationModal from '@/components/common/password-confirmation-modal';
import { toast } from 'sonner';
import md5 from 'md5';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { changeCarouselOrder, deleteCarousel, fetchCarouselList } from '@/utils/api/carousels';
import { HttpStatus } from '@/types/constants';
import { CarousalResponse, Carousel } from '@/types/carousel';
import { useDispatch, useSelector } from '@/store';
import { getStreams } from '@/store/slice/admin/academic';

const AdminCarousel = () => {
  const { streams } = useSelector((state) => state.selectors);
  const dispatch = useDispatch();
  const [formType, setFormType] = useState<FormType | null>(null);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<any>(null);
  const [activeStream, setActiveStream] = useState<number | null>(null);
  const [streamList, setStreamList] = useState<CarousalResponse[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<GenericType>();
  const [activeTab, setActiveTab] = useState<string>('1'); // Default to first stream
  const [selectedStream, setSelectedStream] = useState<GenericType | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [singleCarousel, setSingleCarousel] = useState<Carousel | null>(null);
  const [carouselID, setCarouseldID] = useState<number | null>(null);
  const [standardFilterData, setStandardFilterData] = useState<any>([]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  // Drag Cancel Handler
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveStream(null);
  }, []);

  // Drag handlers
  const handleDragStart = (event: DragStartEvent, streamId: number) => {
    setActiveId(event.active.id);
    setActiveStream(streamId);
  };

  // Carousel Delete Handler
  const handleDelete = (carouselID: number) => {
    setCarouseldID(carouselID);
    setShowPassword(true);
  };

  // Carousel Delete Confirm Handler
  const handleDeleteConfirm = async () => {
    try {
      const deleted = await deleteCarousel(carouselID!);
      if (deleted.statusCode === HttpStatus.OK) {
        toast.success(TosterMessages.CAROUSEL_DELETE_SUCCESS);
        getCarouselList();
      } else {
        toast.error(TosterMessages.CAROUSEL_DELETE_FAIL);
      }
    } catch (error) {
      toast.error(TosterMessages.CAROUSEL_DELETE_FAIL);
      console.log(error);
    } finally {
      setShowDeleteModal(false);
      setCarouseldID(null);
    }
  };

  // Password Confirmation Handler
  const passwordConfirmHandler = async (pass: string) => {
    try {
      // API for password confirmation
      if (profile.user.publish_password == md5(pass)) {
        setShowPassword(false);
        setShowDeleteModal(true);
      } else {
        toast.error(TosterMessages.ADMIN_PASSWORD_ERROR);
        setShowPassword(false);
      }
    } catch (error) {
      toast.error(TosterMessages.CAROUSEL_DELETE_FAIL);
      setShowPassword(false);
    }
  };

  // Drag Success Handler
  const handleDragEnd = useCallback(async (event: DragEndEvent, streamId: number) => {
    const { active, over } = event;

    if (active.id !== over?.id && over?.id) {
      let updatedCarouselIds: number[] = [];

      setStreamList((prevStreams) => {
        return prevStreams.map((stream) => {
          if (stream.streamId === streamId) {
            const carousels = [...stream.carousels];
            const oldIndex = carousels.findIndex((item) => item.id === active.id);
            const newIndex = carousels.findIndex((item) => item.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
              const reorderedCarousels = arrayMove(carousels, oldIndex, newIndex);
              updatedCarouselIds = reorderedCarousels.map((carousel) => carousel.id);
              return {
                ...stream,
                carousels: reorderedCarousels
              };
            }
          }
          return stream;
        });
      });

      // Instead of using state, use the updatedCarouselIds directly
      if (updatedCarouselIds.length > 0) {
        const updatedOrder = await changeCarouselOrder({ carouselIds: updatedCarouselIds });
        if (updatedOrder.status !== HttpStatus.OK) {
          toast.error(TosterMessages.ADMIN_CAROUSEL_ORDER_FAIL);
          return;
        }
        toast.success(TosterMessages.ADMIN_CAROUSEL_ORDER_SUCCESS);
      }
      setActiveId(null);
      setActiveStream(null);
    }
  }, []);

  // Standard Filter Handler
  const standardFilterHandler = (std: GenericType) => {
    setSelectedStandard(std);
  };

  // Find the active carousel for the drag overlay
  const getActiveCarousel = () => {
    if (activeId && activeStream) {
      const stream = streamList.find((s) => s.streamId === activeStream);
      if (stream) {
        return stream.carousels.find((c: any) => c.id === activeId);
      }
    }
    return null;
  };

  // Carousel Form Handler For Both Create and Update
  const handleShowModal = (formType: FormType, streamId: string, carouselID?: number) => {
    const selectedStream = streams.find((stream:GenericType) => stream.id.toString() === streamId);
    if (carouselID) {
      const singleCarousel = streamList.flatMap((stream) => stream.carousels).find((carousel) => carousel.id === carouselID);
      setSingleCarousel(singleCarousel!);
    }

    if (selectedStream) {
      setSelectedStream({
        id: selectedStream.id,
        name: selectedStream.name
      });
    }

    setFormType(formType);
    setShowFormModal(true);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const getCarouselList = async () => {
    try {
      const carousels = await fetchCarouselList();
      setStreamList(carousels);
    } catch (error) {
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
      console.log(error);
    }
  };

  useEffect(() => {
    getCarouselList();
    dispatch(getStreams());
  }, []);

  // Add a new useEffect to handle standard filtering based on active tab
  useEffect(() => {
    if (streamList.length > 0) {
      const activeStreamData = streamList.find((stream) => stream.streamId.toString() === activeTab);

      if (activeStreamData) {
        // Get all standards from the current stream's carousels
        const allStandards = activeStreamData.carousels.flatMap((carousel: any) => carousel.standardList || []);

        // Filter out duplicates and invalid entries
        const uniqueStandards = allStandards
          .filter((standard: any) => standard && standard.id && standard.name)
          .reduce((unique: GenericType[], current: any) => {
            const exists = unique.some((item) => item.id === current.id);
            if (!exists) {
              unique.push({
                id: current.id,
                name: current.name
              });
            }
            return unique;
          }, []);
        setStandardFilterData(uniqueStandards);

        // Reset selected standard when changing tabs
        setSelectedStandard(undefined);
      }
    }
  }, [activeTab, streamList]);

  return (
    <div className="mx-1 sm:mx-3 md:mx-6">
      <AdminSectionHeader
        title="Carousels"
        action={
          <div className="flex w-full justify-end gap-2 sm:w-auto sm:justify-between">
            <SelectDropdown
              data={standardFilterData}
              value={selectedStandard}
              onChange={standardFilterHandler}
              placeholder="Select Standard"
              name="stream"
              size="default"
              width="w-[170px]"
              fontsize="text-sm"
              fontWeight="font-medium"
              primaryIcon={false}
              placeholderColor="text-[#4B4B4B]"
              placeholderSize="md:text-sm"
            />
            <Button
              onClick={() => handleShowModal(FormType.ADD, activeTab)}
              variant="default"
              color="primary"
              size="md"
              className="font-normal md:text-sm"
            >
              <Icon icon="si:add-fill" className="mr-1 text-white md:text-xl" />
              Create Carousel
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="p-0">
          {streams?.map((stream) => (
            <TabsTrigger
              key={stream.id}
              value={stream.id.toString()}
              className={cn(
                'px-4 py-2 text-base font-medium transition-colors md:text-lg',
                activeTab === stream.id.toString()
                  ? 'border-b-2 border-primary text-white data-[state=active]:bg-transparent'
                  : 'text-[#222222]'
              )}
            >
              {stream.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <Separator className="bg-[#10101026]" />

        {streamList.map((stream) => {
          const carouselIds = stream.carousels.map((item: any) => item.id);

          return (
            <TabsContent key={stream.streamId} value={stream.streamId.toString()}>
              <DndContext
                sensors={sensors}
                onDragCancel={handleDragCancel}
                onDragStart={(event) => handleDragStart(event, stream.streamId)}
                onDragEnd={(event) => handleDragEnd(event, stream.streamId)}
                collisionDetection={closestCenter}
              >
                <SortableContext items={carouselIds} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {stream.carousels?.map((banner: any, index: number) => {
                      // Filter carousels based on selected standard
                      const shouldShow =
                        !selectedStandard ||
                        (banner.standardList && banner.standardList.some((std: any) => std.id === selectedStandard.id));

                      return (
                        banner &&
                        shouldShow && (
                          <CarouselCard
                            index={index}
                            row={banner}
                            key={banner.id}
                            title={banner.title}
                            stream={stream.streamName}
                            standard={banner.standardList}
                            description={banner.description}
                            image={banner.desktopImage}
                            onEdit={() => handleShowModal(FormType.EDIT, activeTab, banner.id)}
                            onDelete={() => handleDelete(banner.id)}
                            hideDrag={!!selectedStandard} // Hide drag when a standard is selected
                          />
                        )
                      );
                    })}
                  </div>
                </SortableContext>

                {/* Drag Overlay */}
                <DragOverlay>
                  {activeId && activeStream === stream.streamId ? (
                    <CarouselCard
                      row={getActiveCarousel()}
                      index={-1}
                      title={getActiveCarousel()?.title}
                      stream={stream.streamName}
                      standard={getActiveCarousel()?.standardList}
                      description={getActiveCarousel()?.description}
                      image={getActiveCarousel()?.desktopImage}
                      onEdit={() => handleShowModal(FormType.EDIT, activeTab, stream.streamId)}
                      onDelete={() => handleDelete(stream.streamId)}
                      hideDrag={!!selectedStandard} // Hide drag when a standard is selected
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Carousel Create and Edit Modal */}
      {showFormModal && (
        <CarouselForm
          stream={selectedStream}
          isOpen={showFormModal}
          type={formType}
          initialData={singleCarousel !== null ? singleCarousel : null}
          onClose={() => {
            setShowFormModal(false);
            getCarouselList();
            setSingleCarousel(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          open={showDeleteModal}
          message={'Are you sure you want to delete this carousel?'}
          onClose={() => {
            setShowDeleteModal(false);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Password Confirmation Modal */}
      {showPassword && (
        <PasswordConfirmationModal
          open={showPassword}
          onClose={() => setShowPassword(false)}
          onConfirm={passwordConfirmHandler}
        />
      )}
    </div>
  );
};

export default AdminCarousel;
