using AutoMapper;
using PrissPass.Data.Models.Dto;
using PrissPass.Data.Models.Entity;

namespace PrissPass.Data.Mapper
{
    public class VaultItemMapperProfile : Profile
    {
        public VaultItemMapperProfile()
        {
            // VaultItemRequest to VaultItem (for creating/updating)
            CreateMap<VaultItemRequest, VaultItem>()
                .ForMember(dest => dest.VaultId, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.SiteName, opt => opt.MapFrom(src => src.SiteName))
                .ForMember(dest => dest.EncryptedUrl, opt => opt.MapFrom(src => src.Url))
                .ForMember(dest => dest.EncryptedPassword, opt => opt.MapFrom(src => src.Password))
                .ForMember(dest => dest.EncryptedNotes, opt => opt.MapFrom(src => src.Notes));

            // VaultItem to VaultItemResponse (for retrieving)
            CreateMap<VaultItem, VaultItemResponse>()
                .ForMember(dest => dest.VaultId, opt => opt.MapFrom(src => src.VaultId))
                .ForMember(dest => dest.SiteName, opt => opt.MapFrom(src => src.SiteName))
                .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.EncryptedUrl))
                .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.EncryptedPassword))
                .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.EncryptedNotes));
        }
    }
}
